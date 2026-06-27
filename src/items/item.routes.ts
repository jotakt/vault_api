import { Hono } from "@hono/hono";
import { AppError, isAppError } from "../utils/errors.ts";
import { failure, success } from "../utils/response.ts";
import {
  createDevItem,
  getDevItem,
  listDevItems,
  listTags,
  removeDevItem,
  searchDevItems,
  updateDevItem,
} from "./item.service.ts";
import { CreateDevItemInput, UpdateDevItemInput } from "./item.model.ts";

export const itemRoutes = new Hono();

function handleRouteError(error: unknown, c: any) {
  if (isAppError(error)) {
    return c.json(failure(error.code, error.message), error.status);
  }

  console.error(error);

  return c.json(
    failure("INTERNAL_SERVER_ERROR", "Erro interno no servidor."),
    500,
  );
}

itemRoutes.post("/", async (c) => {
  try {
    const body = await c.req.json<CreateDevItemInput>();
    const item = await createDevItem(body);

    return c.json(success(item), 201);
  } catch (error) {
    return handleRouteError(error, c);
  }
});

itemRoutes.get("/", async (c) => {
  try {
    const type = c.req.query("type");
    const tag = c.req.query("tag");

    const items = await listDevItems({ type, tag });

    return c.json(success(items));
  } catch (error) {
    return handleRouteError(error, c);
  }
});

itemRoutes.get("/search", async (c) => {
  try {
    const q = c.req.query("q") ?? "";
    const items = await searchDevItems(q);

    return c.json(success(items));
  } catch (error) {
    return handleRouteError(error, c);
  }
});

itemRoutes.get("/tags", async (c) => {
  try {
    const tags = await listTags();

    return c.json(success(tags));
  } catch (error) {
    return handleRouteError(error, c);
  }
});

itemRoutes.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json<UpdateDevItemInput>();

    const item = await updateDevItem(id, body);

    return c.json(success(item));
  } catch (error) {
    return handleRouteError(error, c);
  }
});

itemRoutes.patch("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json<UpdateDevItemInput>();

    const item = await updateDevItem(id, body);

    return c.json(success(item));
  } catch (error) {
    return handleRouteError(error, c);
  }
});

itemRoutes.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await removeDevItem(id);

    return c.json(
      success({
        message: "Item removido com sucesso.",
      }),
    );
  } catch (error) {
    return handleRouteError(error, c);
  }
});
