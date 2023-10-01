import crypto from "node:crypto";
import { event } from "@backend/core/event-builder";
import { logger } from "logger";
import { z } from "zod";

export const Events = {
  Created: event("link.created", {
    id: z.string(),
  }),
};

export async function create(): Promise<void> {
  const id = crypto.randomUUID();
  // write to database

  await Events.Created.publish({
    id,
  });

  logger.info("Link created");
}

export function archive(): void {
  logger.info("Link archived");
}

export function remove(): void {
  logger.info("Link removed");
}
