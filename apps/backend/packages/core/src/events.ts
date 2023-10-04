import { z } from "zod";
import { event } from "./event-builder";

export const Events = {
  Categorised: event("link.categorised", {
    id: z.string(),
    categories: z.array(z.string()),
    summary: z.string(),
    title: z.string(),
    url: z.string().url(),
  }),
  Created: event("link.created", {
    id: z.string(),
  }),
  Stored: event("link.stored", {
    id: z.string(),
    url: z.string().url(),
  }),
  StoredCategorised: event("link.stored.categorised", {
    id: z.string(),
    categories: z.array(z.string()),
    summary: z.string(),
    title: z.string(),
    url: z.string().url(),
  }),
  Submitted: event("link.submitted", {
    id: z.string(),
    url: z.string().url(),
  }),
};
