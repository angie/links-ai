import { links } from "@backend/core/db";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- electrodb generated type, not exported and not worth redefining
export function createLink({ id, url }: { id: string; url: string }) {
  return links.create({ id, url }).go();
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- electrodb generated type, not exported and not worth redefining
export async function updateLink({
  id,
  categories,
  summary,
  title,
}: {
  id: string;
  categories: string[];
  summary: string;
  title: string;
  url: string;
}) {
  const link = await links
    .patch({ id })
    .set({
      categories,
      summary,
      title,
    })
    .go();

  return link;
}
