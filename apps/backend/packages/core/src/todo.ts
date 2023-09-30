import crypto from "node:crypto";
// import { z } from "zod";
import { event } from "./event";

export const Events = {
  Created: event("todo.created", {
    // id: z.string(),
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
