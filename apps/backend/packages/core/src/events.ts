import { event } from "./event-builder";
import { baseSchema, processedSchema } from "./types/link";

const fullLinkSchemaForCategorisationEvents = {
  ...baseSchema,
  ...processedSchema,
};

export const Events = {
  Categorised: event("link.categorised", fullLinkSchemaForCategorisationEvents),
  Created: event("link.created", {
    id: baseSchema.id,
  }),
  Removed: event("link.removed", {
    id: baseSchema.id,
  }),
  Stored: event("link.stored", baseSchema),
  StoredCategorised: event(
    "link.stored.categorised",
    fullLinkSchemaForCategorisationEvents,
  ),
  Submitted: event("link.submitted", baseSchema),
};
