import { Match, Template } from "aws-cdk-lib/assertions";
import { getStack } from "sst/constructs";
import { links } from "../links";
import { bus } from "../event-bus";
import { initProjectWithStacks } from "./utils";

beforeAll(async () => {
  // init sst project context
  await initProjectWithStacks();
});

test("API gateway has expected routes", () => {
  const template = Template.fromStack(getStack(links));

  template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
    RouteKey: "GET /",
  });

  template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
    RouteKey: "GET /links",
  });

  template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
    RouteKey: "POST /links",
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
  const template = Template.fromStack(getStack(links));

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
