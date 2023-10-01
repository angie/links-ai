import type { StackContext } from "sst/constructs";
import { EventBus } from "sst/constructs";

export function bus({ stack }: StackContext): { bus: EventBus } {
  const eventBus = new EventBus(stack, "bus", {
    defaults: {
      retries: 10,
    },
  });

  return { bus: eventBus };
}
