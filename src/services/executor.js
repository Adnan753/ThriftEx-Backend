const { EC2Client, StopInstancesCommand, DescribeInstancesCommand } = require("@aws-sdk/client-ec2");
const supabase = require('../db/db');

const ec2Client = new EC2Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

async function saveRecommendation (recommendation) {
    const { data, error } = await supabase
        .from('recommendations')
        .insert({
            service: recommendation.service,
            action: recommendation.action,
            priority: recommendation.priority,
            estimated_saving: recommendation.estimated_saving,
            reasoning: recommendation.reasoning,
            status: 'pending'
        })
        .select()
        .single();

    if (error) throw error;

    return data;
}

async function getPendingRecommendations () {
    const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if  (error) throw error;

    return data;
}

async function executeRecommendation (recommendationId) {
    const { data: rec, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('id', recommendationId)
        .single();

    if (error) throw error;
    if (!rec) throw new Error ('Recommendation not found');
    if (rec.status !== 'pending') throw new Error ('Recommendation already executed or invalid status');

    let executionResult = null;

    if (rec.service.toLowerCase().includes('ec2')) {
        executionResult = await handleEC2Action(rec.action);
    } else {
        executionResult = {
            status: 'manual_required',
            message: 'This action requires manual executions in AWS Console or CLI',
            action: rec.action
        };
    }

    const { data: updated, error: updateError} = await supabase
        .from('recommendations')
        .update({
            status: 'executed',
            executed_at: new Date().toISOString()
        })
        .eq('id', recommendationId)
        .select()
        .single();

    if (updateError) throw updateError;

    return { 
        recommendation: updated,
        result: executionResult
    }
}

async function handleEC2Action (action) {
    const describeCommand = new DescribeInstancesCommand({
        Filters:[{ Name: 'instance-state-name', Values: ['running']}]
    });

    const response = await ec2Client.send(describeCommand);
    const instances = [];

    for (const reservation of response.Reservations || []) {
        for ( const instance of reservation.Instances || []) {
            instances.push({
                id: instance.InstanceId,
                type: instance.InstanceType,
                state: instance.State.Name,
                launchTime: instance.LaunchTime
            });
        }
    }

    if (instances.length === 0) {
        return {
            status: 'no_action',
            message: 'No running EC2 instances found to optimize'
        };
    }

    return {
        status: 'identified',
        message: `Found ${instances.length} running EC2 instance(s). Manual approval required before stopping.`,
        instances
    };
}

async function dismissRecommendation (recommendationId) {
    const { data, error } = await supabase
        .from('recommendations')
        .update({ status: 'dismissed' })
        .eq('id', recommendationId)
        .select()
        .single();

    if (error) throw error;
    
    return data;
}

module.exports = {
    saveRecommendation,
    getPendingRecommendations,
    executeRecommendation,
    dismissRecommendation
};