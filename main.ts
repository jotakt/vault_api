import { app } from "./src/app.ts";

const port = Number(Deno.env.get("PORT") ?? 8000);
Deno.serve({ port }, app.fetch);

console.log(`API rodando em http://localhost:${port}`);
