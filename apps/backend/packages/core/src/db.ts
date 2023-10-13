import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import type { EntityConfiguration } from "electrodb";
import { Entity } from "electrodb";
import { Table } from "sst/node/table";

const client = new DynamoDBClient({});
const config: EntityConfiguration = {
  // @ts-expect-error -- for some reason this is not being picked up from sst types
  table: Table["app-table"].tableName,
  client,
};

export const links = new Entity(
  {
    model: {
      entity: "link",
      version: "1",
      service: "storage",
    },
    attributes: {
      id: {
        type: "string",
      },
      userId: {
        type: "string",
        required: true,
        default: "1",
      },
      url: {
        type: "string",
        required: true,
      },
      categories: {
        type: "list",
        items: {
          type: "string",
        },
      },
      summary: {
        type: "string",
      },
      title: {
        type: "string",
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
      deletedAt: {
        type: "string",
        required: false,
      },
    },
    indexes: {
      byId: {
        pk: {
          field: "pk",
          composite: ["id"],
        },
        sk: {
          field: "sk",
          composite: [],
        },
      },
      byUrl: {
        index: "gsi1",
        pk: {
          field: "gsi1pk",
          composite: ["url"],
        },
        sk: {
          field: "gsi1sk",
          composite: [],
        },
      },
    },
  },
  config,
);
