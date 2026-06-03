const { CloudWatchLogsClient, FilterLogEventsCommand } = require("@aws-sdk/client-cloudwatch-logs");
const client = new CloudWatchLogsClient({ region: "eu-north-1" });
async function getLogs() {
  const command = new FilterLogEventsCommand({
    logGroupName: "/copilot/multi-tenant-system-production-rds-backend",
    filterPattern: "Error",
    limit: 50,
  });
  const response = await client.send(command);
  for (const event of response.events) {
    console.log(event.message);
  }
}
getLogs();
