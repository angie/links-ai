import { EventHandler } from "sst/node/event-bus";
import * as Todo from "@backend/core/todo";

export const handler = EventHandler(Todo.Events.Created, async (evt) => {
  console.log("Todo created", evt);
  await Promise.resolve("hello");
});
