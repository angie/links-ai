import { Match, Template } from "aws-cdk-lib/assertions";
import { getStack } from "sst/constructs";
import { bus } from "../event-bus";
import { linkIngest } from "../ingest";
import { linkQuery } from "../query";
import { table } from "../table";
import { initProjectWithStacks } from "./utils";

beforeAll(async () => {
  // init sst project context
  await initProjectWithStacks();
});

test("link ingest API gateway has expected routes", () => {
  const template = Template.fromStack(getStack(linkIngest));

  template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
    RouteKey: "POST /submit",
  });

  template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
    RouteKey: "PATCH /links/{id}",
  });

  template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
    RouteKey: "DELETE /links/{id}",
  });
});

test("link query API gateway has expected routes", () => {
  const template = Template.fromStack(getStack(linkQuery));

  template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
    RouteKey: "GET /links",
  });

  template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
    RouteKey: "GET /links/{id}",
  });

  template.hasResourceProperties("AWS::ApiGatewayV2::Route", {
    RouteKey: "GET /links/category/{category}",
  });
});

test("bus has subscriber for `link.submitted` event", () => {
  const template = Template.fromStack(getStack(bus));

  template.hasResourceProperties(
    "AWS::Events::Rule",
    Match.objectLike({
      EventPattern: {
        "detail-type": ["link.submitted"],
      },
      State: "ENABLED",
    }),
  );
});

test("bus has subscriber for `link.stored` event", () => {
  const template = Template.fromStack(getStack(bus));

  template.hasResourceProperties(
    "AWS::Events::Rule",
    Match.objectLike({
      EventPattern: {
        "detail-type": ["link.stored"],
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
          AttributeName: "pk",
          KeyType: "HASH",
        },
        {
          AttributeName: "sk",
          KeyType: "RANGE",
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: "pk",
          AttributeType: "S",
        },
        {
          AttributeName: "sk",
          AttributeType: "S",
        },
        {
          AttributeName: "gsi1pk",
          AttributeType: "S",
        },
        {
          AttributeName: "gsi1sk",
          AttributeType: "S",
        },
        {
          AttributeName: "gsi2pk",
          AttributeType: "S",
        },
        {
          AttributeName: "gsi2sk",
          AttributeType: "S",
        },
      ],
      BillingMode: "PAY_PER_REQUEST",
    }),
  );
});

test("passes OpenAI api key to event bus subscriber", () => {
  const template = Template.fromStack(getStack(bus));

  template.hasResourceProperties(
    "AWS::Lambda::Function",
    Match.objectLike({
      Environment: Match.objectLike({
        Variables: Match.objectLike({
          SST_Secret_value_OPENAI_API_KEY: "__FETCH_FROM_SSM__",
        }),
      }),
    }),
  );
});
