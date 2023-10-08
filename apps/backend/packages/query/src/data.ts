import { links } from "@backend/core/db";
import type { Link } from "@backend/core/types/link";

export async function getAllLinks(): Promise<{ data: Link[] }> {
  const { data } = await links.scan.go();

  return { data };
}
