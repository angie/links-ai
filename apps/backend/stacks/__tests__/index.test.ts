import { Match, Template } from "aws-cdk-lib/assertions";
import { getStack } from "sst/constructs";
import { linkSubmission } from "../link-submission";
import { bus } from "../event-bus";
import { table } from "../table";
import { initProjectWithStacks } from "./utils";

beforeAll(async () => {
  // init sst project context
  await initProjectWithStacks();
});

test("API gateway has expected routes", () => {
  const template = Template.fromStack(getStack(linkSubmission));

  template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
    RouteKey: "POST /submit",
  });

  template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
    RouteKey: "DELETE /links/{linkId}",
  });
});

test("bus has subscriber for `link.created` event", () => {
  const template = Template.fromStack(getStack(bus));

  template.hasResourceProperties(
    "AWS::Events::Rule",
    Match.objectLike({
      EventPattern: {
        "detail-type": ["link.created"],
      },
      State: "ENABLED",
    }),
  );
});

test("dynamo table is created", () => {
  const template = Template.fromStack(getStack(table));

  template.hasResourceProperties(
    "AWS::DynamoDB::Table",
    Match.objectLike({
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    }),
  );
});
