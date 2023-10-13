import { links } from "@backend/core/db";
import type { Link } from "@backend/core/types/link";
import { DataError } from "@backend/core/errors";

export async function markDeleted(id: string): Promise<Link | null> {
  try {
    const { data } = await links
      .patch({ id })
      .set({ isDeleted: true, deletedAt: new Date().toISOString() })
      .go({ response: "all_new" });

    return data;
  } catch (error) {
    throw new DataError(`Failed to mark link as deleted: ${id}`, error);
  }
}
