import { Hono } from "hono";
import { itemRoutes } from "./items/item.routes.ts";

export const app = new Hono();

app.get("/", (c) => {
  return c.json({
    name: "Vault API",
    description:
      "API para salvar snippets, comandos, links e notas de desenvolvimento",
    version: "1.0.0",
  });
});

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.route("/api/items", itemRoutes);

app.notFound((c) => {
  return c.json({
    error: "NOT_FOUND",
    message: "Rota não encontrada.",
  }, 404);
});
