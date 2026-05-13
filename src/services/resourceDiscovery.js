const { EC2Client, DescribeInstancesCommand, DescribeVolumesCommand } = require('@aws-sdk/client-ec2');
const { RDSClient, DescribeDBInstancesCommand } = require('@aws-sdk/client-rds');
const { S3Client, ListBucketsCommand, GetBucketLocationCommand } = require('@aws-sdk/client-s3');

const ec2Client = new EC2Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const rdsClient = new RDSClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

async function discoverEC2Instances() {
    const command = new DescribeInstancesCommand({});
    const response = await ec2Client.send(command);

    const instances = [];
    for (const reservation of response.Reservations || []) {
        for (const instance of reservation.Instances || []) {
            const name = instance.Tags?.find(t => t.Key === 'Name')?.Value || 'Unnamed';
            instances.push({
                id: instance.InstanceId,
                name,
                type: instance.InstanceType,
                state: instance.State.Name,
                region: process.env.AWS_REGION || 'us-east-1',
                launch_time: instance.LaunchTime,
                is_idle: instance.State.Name === 'stopped',
                platform: instance.Platform || 'linux'
            });
        }
    }
    return instances;
}

async function discoverRDSInstances() {
    const command = new DescribeDBInstancesCommand({});
    const response = await rdsClient.send(command);

    return (response.DBInstances || []).map(db => ({
        id: db.DBInstanceIdentifier,
        engine: db.Engine,
        engine_version: db.EngineVersion,
        instance_class: db.DBInstanceClass,
        status: db.DBInstanceStatus,
        storage_gb: db.AllocatedStorage,
        region: process.env.AWS_REGION || 'us-east-1',
        is_idle: db.DBInstanceStatus !== 'available'
    }));
}

async function discoverS3Buckets() {
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);

    const buckets = [];
    for (const bucket of response.Buckets || []) {
        buckets.push({
            name: bucket.Name,
            created: bucket.CreationDate,
            region: process.env.AWS_REGION || 'us-east-1'
        });
    }
    return buckets;
}

async function discoverAllResources() {
    const [ec2, rds, s3] = await Promise.allSettled([
        discoverEC2Instances(),
        discoverRDSInstances(),
        discoverS3Buckets()
    ]);

    return {
        ec2: ec2.status === 'fulfilled' ? ec2.value : [],
        rds: rds.status === 'fulfilled' ? rds.value : [],
        s3: s3.status === 'fulfilled' ? s3.value : [],
        summary: {
            total_ec2: ec2.status === 'fulfilled' ? ec2.value.length : 0,
            total_rds: rds.status === 'fulfilled' ? rds.value.length : 0,
            total_s3: s3.status === 'fulfilled' ? s3.value.length : 0,
            idle_ec2: ec2.status === 'fulfilled' ? ec2.value.filter(i => i.is_idle).length : 0
        }
    };
}

module.exports = { discoverAllResources };