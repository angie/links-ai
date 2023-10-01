import { Match, Template } from "aws-cdk-lib/assertions";
import { App, getStack } from "sst/constructs";
import { links } from "../links";
import { initSstProject } from "./utils";

beforeAll(async () => {
  // init sst project context
  await initSstProject();
});

test("API gateway has expected routes", () => {
  const app = new App({ mode: "deploy", stage: "test" });
  app.stack(links);

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
  const template = Template.fromStack(getStack(links));

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
