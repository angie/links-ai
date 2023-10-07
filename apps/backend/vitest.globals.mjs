// set sst environment variables so that the test runner doesn't try to call out to AWS
// https://discord.com/channels/983865673656705025/983865673656705028/1037584538035036170
// https://discord.com/channels/983865673656705025/983865673656705028/1037586033950330880
export function setup() {
  process.env.SST_Api_url_ingest_api = "";
  process.env.SST_Api_url_query_api = "";
  process.env.SST_APP = "test-backend";
  process.env.SST_EventBus_eventBusName_bus = "test-backend-bus";
  process.env.SST_Secret_value_OPENAI_API_KEY = "openapi-key";
  process.env.SST_STAGE = "test";
  process.env.SST_Table_tableName_app_table = "test-backend-app-table";
  process.env.AWS_REGION = "us-east-1";

  process.env.AWS_ACCESS_KEY_ID = "";
  process.env.AWS_PROFILE = "";
  process.env.AWS_SECRET_ACCESS_KEY = "";
  process.env.AWS_SESSION_TOKEN = "";
}
