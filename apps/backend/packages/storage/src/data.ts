import type { EntityConfiguration } from "electrodb";
import { Entity } from "electrodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Table } from "sst/node/table";

const client = new DynamoDBClient({});
const config: EntityConfiguration = {
  table: Table["app-table"].tableName,
  client,
};

const links = new Entity(
  {
    model: {
      entity: "link",
      version: "1",
      service: "storage",
    },
    attributes: {
      id: {
        type: "string",
        required: true,
      },
      userId: {
        type: "string",
        required: true,
      },
      url: {
        type: "string",
        required: true,
        unique: true,
      },
      timestamp: {
        type: "string",
        default: () => new Date().toISOString(),
      },
      isArchived: {
        type: "boolean",
        default: false,
      },
      isDeleted: {
        type: "boolean",
        default: false,
      },
    },
    indexes: {
      main: {
        pk: {
          field: "pk",
          composite: ["userId", "url"],
        },
        sk: {
          field: "sk",
          composite: ["url"],
        },
      },
    },
  },
  config,
);

export async function createLink({ id, url }: { id: string; url: string }) {
  const link = await links.put({ id, userId: "1", url }).go();

  return link;
}
