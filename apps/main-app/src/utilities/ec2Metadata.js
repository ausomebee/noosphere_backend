const METADATA_BASE_URL = "http://169.254.169.254/latest";

let instanceIdPromise;

export async function getInstanceId() {
    const configuredInstanceId = process.env.INSTANCE_ID || process.env.EC2_INSTANCE_ID;
    if (configuredInstanceId) return configuredInstanceId;

    if (!instanceIdPromise) {
        instanceIdPromise = (async () => {
            const tokenResponse = await fetch(`${METADATA_BASE_URL}/api/token`, {
                method: "PUT",
                headers: { "X-aws-ec2-metadata-token-ttl-seconds": "21600" },
                signal: AbortSignal.timeout(5000)
            });

            if (!tokenResponse.ok) throw new Error("Unable to obtain IMDSv2 token");
            const token = (await tokenResponse.text()).trim();

            const response = await fetch(`${METADATA_BASE_URL}/meta-data/instance-id`, {
                headers: { "X-aws-ec2-metadata-token": token },
                signal: AbortSignal.timeout(5000)
            });

            if (!response.ok) throw new Error("Unable to retrieve EC2 instance ID");
            const instanceId = (await response.text()).trim();
            if (!instanceId) throw new Error("EC2 metadata returned an empty instance ID");

            process.env.EC2_INSTANCE_ID = instanceId;
            process.env.INSTANCE_ID = instanceId;
            return instanceId;
        })().catch((error) => {
            instanceIdPromise = undefined;
            throw error;
        });
    }

    return instanceIdPromise;
}
