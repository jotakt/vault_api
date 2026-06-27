import { keys, kv } from "../db/kv.ts";
import { DevItem } from "./item.model.ts";

async function getItemIds(): Promise<string[]> {
  const result = await kv.get<string[]>(keys.itemsIndex);
  return result.value ?? [];
}

async function saveItemIds(ids: string[]): Promise<void> {
  await kv.set(keys.itemsIndex, ids);
}

export async function createItem(item: DevItem): Promise<DevItem> {
  await kv.set(keys.item(item.id), item);

  const ids = await getItemIds();

  if (!ids.includes(item.id)) {
    ids.push(item.id);
    await saveItemIds(ids);
  }

  return item;
}

export async function findAllItems(): Promise<DevItem[]> {
  const ids = await getItemIds();
  const items: DevItem[] = [];

  for (const id of ids) {
    const result = await kv.get<DevItem>(keys.item(id));

    if (result.value) {
      items.push(result.value);
    }
  }

  return items.sort((a, b) => {
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export async function findItemById(id: string): Promise<DevItem | null> {
  const result = await kv.get<DevItem>(keys.item(id));
  return result.value;
}

export async function updateItem(item: DevItem): Promise<DevItem> {
  await kv.set(keys.item(item.id), item);
  return item;
}

export async function deleteItem(id: string): Promise<void> {
  await kv.delete(keys.item(id));

  const ids = await getItemIds();
  const nextIds = ids.filter((itemId) => itemId !== id);

  await saveItemIds(nextIds);
}
