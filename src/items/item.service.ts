import { AppError } from "../utils/errors.ts";
import {
  CreateDevItemInput,
  DevItem,
  ItemType,
  UpdateDevItemInput,
} from "./item.model.ts";
import {
  createItem,
  deleteItem,
  findAllItems,
  findItemById,
  updateItem,
} from "./item.repository.ts";

const validTypes: ItemType[] = ["snippet", "command", "link", "note"];

function validateType(type: string): asserts type is ItemType {
  if (!validTypes.includes(type as ItemType)) {
    throw new AppError(
      400,
      "INVALID_TYPE",
      "Tipo inválido. Use: snippet, command, link ou note.",
    );
  }
}

function normalizeTags(tags: string[] = []): string[] {
  return tags
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .filter((tag, index, array) => array.indexOf(tag) === index);
}

function validadeCreateInput(input: CreateDevItemInput): void {
  if (!input.title || input.title.trim().length < 3) {
    throw new AppError(
      400,
      "INVALID_TITLE",
      "O conteúdo é obrigatório.",
    );
  }

  validateType(input.type);
}

export async function createDevItem(
  input: CreateDevItemInput,
): Promise<DevItem> {
  validadeCreateInput(input);

  const now = new Date().toISOString();

  const item: DevItem = {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    type: input.type,
    content: input.content.trim(),
    tags: normalizeTags(input.tags),
    createdAt: now,
    updatedAt: now,
  };

  return await createItem(item);
}

export async function listDevItems(filters?: {
  type?: string;
  tag?: string;
}): Promise<DevItem[]> {
  let items = await findAllItems();

  if (filters?.type) {
    validateType(filters.type);
    items = items.filter((item) => item.type === filters.type);
  }

  if (filters?.tag) {
    const tag = filters.tag.toLowerCase().trim();
    items = items.filter((item) => item.tags.includes(tag));
  }

  return items;
}

export async function getDevItem(id: string): Promise<DevItem> {
  const item = await findItemById(id);

  if (!item) {
    throw new AppError(
      404,
      "ITEM_NOT_FOUND",
      "Item não encontrado.",
    );
  }

  return item;
}

export async function updateDevItem(
  id: string,
  input: UpdateDevItemInput,
): Promise<DevItem> {
  const current = await getDevItem(id);

  if (input.type) {
    validateType(input.type);
  }

  if (input.title !== undefined && input.title.trim().length < 3) {
    throw new AppError(
      400,
      "INVALID_TYPE",
      "O título precisa ter pelo menos 3 caracteres.",
    );
  }

  const updated: DevItem = {
    ...current,
    title: input.title?.trim() ?? current.title,
    type: input.type ?? current.type,
    content: input.content?.trim() ?? current.content,
    tags: input.tags ? normalizeTags(input.tags) : current.tags,
    updatedAt: new Date().toISOString(),
  };

  return await updateItem(updated);
}

export async function removeDevItem(id: string): Promise<void> {
  await getDevItem(id);
  await deleteItem(id);
}

export async function searchDevItems(query: string): Promise<DevItem[]> {
  const q = query.toLowerCase().trim();

  if (!q) {
    throw new AppError(
      400,
      "INVALID_QUERY",
      "Informe uma busca válida.",
    );
  }

  const items = await findAllItems();

  return items.filter((item) => {
    const searchableText = [
      item.title,
      item.type,
      item.content,
      ...item.tags,
    ].join(" ").toLocaleLowerCase();

    return searchableText.includes(q);
  });
}

export async function listTags(): Promise<string[]> {
  const items = await findAllItems();

  const tags = new Set<string>();

  for (const item of items) {
    for (const tag of item.tags) {
      tags.add(tag);
    }
  }

  return Array.from(tags).sort();
}
