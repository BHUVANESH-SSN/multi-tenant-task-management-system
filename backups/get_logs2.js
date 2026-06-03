const { CloudWatchLogsClient, FilterLogEventsCommand } = require("@aws-sdk/client-cloudwatch-logs");
const client = new CloudWatchLogsClient({ region: "eu-north-1" });
async function getLogs() {
  let command = new FilterLogEventsCommand({
    logGroupName: "/copilot/multi-tenant-system-production-rds-backend",
    limit: 100,
  });
  let response = await client.send(command);
  for (const event of response.events) {
    if (event.message.includes("OAuth")) {
      console.log(event.message);
    }
  }
}
getLogs();
