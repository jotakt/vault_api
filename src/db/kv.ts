export const kv = await Deno.openKv();

export const keys = {
  item: (id: string) => ["items", id],
  itemsIndex: ["items_index"],
} as const;
