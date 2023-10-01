import { z } from "zod";
import { event } from "./event-builder";

export const Events = {
  Created: event("link.created", {
    id: z.string(),
  }),
};
