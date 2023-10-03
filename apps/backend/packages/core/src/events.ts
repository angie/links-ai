import { z } from "zod";
import { event } from "./event-builder";

export const Events = {
  Created: event("link.created", {
    id: z.string(),
  }),
  Stored: event("link.stored", {
    id: z.string(),
    url: z.string().url(),
  }),
  Submitted: event("link.submitted", {
    id: z.string(),
    url: z.string().url(),
  }),
};
