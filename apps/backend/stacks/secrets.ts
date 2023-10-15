import type { StackContext } from "sst/constructs";
import { Config } from "sst/constructs";

type Secrets = Record<string, Config.Secret>;

export function secrets({ stack }: StackContext): Secrets {
  const SECURE_TOKEN = new Config.Secret(stack, "SECURE_TOKEN");

  return { SECURE_TOKEN };
}
