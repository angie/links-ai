import { links } from "@backend/core/db";
import type { Link } from "@backend/core/types/link";
import { DataError } from "@backend/core/errors";

export async function getAllLinks(): Promise<{ data: Link[] }> {
  try {
    const { data } = await links.scan.go();

    return { data };
  } catch (error) {
    throw new DataError("Failed to get all links", error);
  }
}

export async function getLinkById(id: string): Promise<Link | null> {
  try {
    const { data } = await links.get({ id }).go();

    return data;
  } catch (error) {
    throw new DataError(`Failed to get link by id: ${id}`, error);
  }
}
