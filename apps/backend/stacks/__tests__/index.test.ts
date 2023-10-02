import { Match, Template } from "aws-cdk-lib/assertions";
import { getStack } from "sst/constructs";
import { bus } from "../event-bus";
import { linkCategorisation } from "../categorisation";
import { linkIngest } from "../ingest";
import { table } from "../table";
import { initProjectWithStacks } from "./utils";

beforeAll(async () => {
  // init sst project context
  await initProjectWithStacks();
});

test("link submission API gateway has expected routes", () => {
  const template = Template.fromStack(getStack(linkIngest));

  template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
    RouteKey: "POST /submit",
  });

  template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
    RouteKey: "DELETE /links/{linkId}",
  });
});

test("link categorisation API gateway has expected route", () => {
  const template = Template.fromStack(getStack(linkCategorisation));

  template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
    RouteKey: "GET /links/category/{category}",
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
