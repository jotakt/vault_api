export type ItemType = "snippet" | "command" | "link" | "note";

export interface DevItem {
  id: string;
  title: string;
  type: ItemType;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDevItemInput {
  title: string;
  type: ItemType;
  content: string;
  tags?: string[];
}

export interface UpdateDevItemInput {
  title?: string;
  type?: ItemType;
  content?: string;
  tags?: string[];
}
