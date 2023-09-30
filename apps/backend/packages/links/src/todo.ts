import crypto from "node:crypto";
import { event } from "@backend/core/event";
import { z } from "zod";

export const Events = {
  Created: event("todo.created", {
    id: z.string(),
  }),
};

export async function create(): Promise<void> {
  const id = crypto.randomUUID();
  // write to database

  await Events.Created.publish({
    id,
  });
}

export function list(): { id: string; title: string }[] {
  return Array(50)
    .fill(0)
    .map((_, index) => ({
      id: crypto.randomUUID(),
      title: `Todo #${index}`,
    }));
}
