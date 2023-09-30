import { Template } from "aws-cdk-lib/assertions";
import { initProject } from "sst/project";
import { App, getStack } from "sst/constructs";
import { links } from "../links";

const IS_RUNNING_FROM_MONOREPO = !process.cwd().includes("apps/backend");

test("API gateway has expected routes", async () => {
  // set up project and stack
  // TODO: find out how to set the root path relative to the package, not monorepo root
  await initProject({
    root: IS_RUNNING_FROM_MONOREPO
      ? `${process.cwd()}/apps/backend`
      : process.cwd(),
    stage: "test",
  });
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
