import crypto from "node:crypto";
import { Events } from "@backend/core/events";
import { logger } from "logger";

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
