import { LayerVersion } from "aws-cdk-lib/aws-lambda";
import type { StackContext } from "sst/constructs";
import { Config, use } from "sst/constructs";
import { bus as busStack } from "./event-bus";
import { table as tableStack } from "./table";

export function linkCategorisation({ app, stack }: StackContext): void {
  const { bus } = use(busStack);
  const { table } = use(tableStack);

  // https://github.com/shelfio/chrome-aws-lambda-layer
  const layerArn =
    "arn:aws:lambda:eu-west-2:764866452798:layer:chrome-aws-lambda:38";
  const layer = LayerVersion.fromLayerVersionArn(
    stack,
    "chromeLayer",
    layerArn,
  );

  const OPENAI_API_KEY = new Config.Secret(stack, "OPENAI_API_KEY");

  bus.subscribe("link.stored", {
    bind: [bus, table, OPENAI_API_KEY],
    handler: "packages/categorisation/src/index.handler",
    runtime: "nodejs18.x",
    // sometimes playwright is slow
    timeout: 120,
    layers: [layer],
    nodejs: {
      install: ["@sparticuz/chromium"],
    },
    environment: {
      IS_LOCAL: app.local.toString(),
    },
  });
}
