# Vault API

![Deno](https://img.shields.io/badge/Deno-000?style=for-the-badge&logo=deno&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Hono](https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=hono&logoColor=white)

<br />

API REST feita com **Deno**, **Hono** e **TypeScript** para salvar snippets,
comandos úteis, links técnicos e anotações rápidas do dia a dia de
desenvolvimento.

A ideia do projeto é funcionar como um pequeno cofre pessoal para conhecimento
técnico: comandos que você sempre esquece, trechos de código reaproveitáveis,
links importantes de documentação e notas curtas sobre problemas resolvidos.

---

- **Deno** — runtime moderno para TypeScript/JavaScript
- **Hono** — framework web leve e rápido
- **TypeScript** — tipagem estática
- **Deno KV** — persistência local simples em chave-valor

---

## Funcionalidades

- Criar anotações técnicas
- Salvar comandos úteis
- Salvar snippets de código
- Salvar links importantes
- Organizar itens por tags
- Filtrar por tipo
- Filtrar por tag
- Buscar por texto
- Listar todas as tags usadas
- Atualizar e remover registros

---

## Tipos de item

A API trabalha com quatro tipos principais:

```ts
"snippet" | "command" | "link" | "note";
```

Exemplo de uso:

```json
{
  "title": "Rodar projeto Deno com watch",
  "type": "command",
  "content": "deno task dev",
  "tags": ["deno", "hono", "api"]
}
```

---

## Estrutura do projeto

```txt
devvault-api/
├── deno.json
├── main.ts
└── src/
    ├── app.ts
    ├── db/
    │   └── kv.ts
    ├── items/
    │   ├── item.model.ts
    │   ├── item.repository.ts
    │   ├── item.service.ts
    │   └── item.routes.ts
    └── utils/
        ├── errors.ts
        └── response.ts
```

A estrutura separa responsabilidades de forma simples:

- `routes`: entrada HTTP da aplicação
- `service`: regras de negócio e validações
- `repository`: acesso ao banco
- `model`: tipos e contratos da entidade
- `utils`: respostas e tratamento de erros

---

## Como rodar o projeto

## Instalação

Tenha o [Deno](https://deno.com) instalado

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/devvault-api.git
cd devvault-api
```

Rode em modo desenvolvimento:

```bash
deno task dev
```

A API ficará disponível em:

```txt
http://localhost:8000
```

---

## Scripts disponíveis

```bash
deno task dev
```

Roda a aplicação em modo desenvolvimento com watch.

```bash
deno task start
```

Roda a aplicação normalmente.

```bash
deno task check
```

Verifica tipos do projeto.

```bash
deno task fmt
```

Formata os arquivos.

```bash
deno task lint
```

Executa o linter do Deno.

---

## Rotas da API

| Método   | Rota                        | Descrição                     |
| -------- | --------------------------- | ----------------------------- |
| `GET`    | `/`                         | Informações básicas da API    |
| `GET`    | `/health`                   | Verifica se a API está online |
| `POST`   | `/api/items`                | Cria um novo item             |
| `GET`    | `/api/items`                | Lista todos os itens          |
| `GET`    | `/api/items/:id`            | Busca um item por ID          |
| `PATCH`  | `/api/items/:id`            | Atualiza um item              |
| `DELETE` | `/api/items/:id`            | Remove um item                |
| `GET`    | `/api/items/search?q=texto` | Busca itens por texto         |
| `GET`    | `/api/items/tags`           | Lista todas as tags           |

---

## Criar um item

```bash
curl -X POST http://localhost:8000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Rodar Deno com watch",
    "type": "command",
    "content": "deno task dev",
    "tags": ["deno", "hono", "backend"]
  }'
```

Resposta esperada:

```json
{
  "success": true,
  "data": {
    "id": "b2a4d4f9-1a3e-4c21-9f33-123456789abc",
    "title": "Rodar Deno com watch",
    "type": "command",
    "content": "deno task dev",
    "tags": ["deno", "hono", "backend"],
    "createdAt": "2026-06-27T21:00:00.000Z",
    "updatedAt": "2026-06-27T21:00:00.000Z"
  }
}
```

---

## Listar itens

```bash
curl http://localhost:8000/api/items
```

Filtrar por tipo:

```bash
curl "http://localhost:8000/api/items?type=command"
```

Filtrar por tag:

```bash
curl "http://localhost:8000/api/items?tag=deno"
```

---

## Buscar por texto

```bash
curl "http://localhost:8000/api/items/search?q=watch"
```

---

## Atualizar um item

```bash
curl -X PATCH http://localhost:8000/api/items/ID_DO_ITEM \
  -H "Content-Type: application/json" \
  -d '{
    "tags": ["deno", "hono", "backend", "produtividade"]
  }'
```

---

## Remover um item

```bash
curl -X DELETE http://localhost:8000/api/items/ID_DO_ITEM
```

---

## Modelo de dados

```ts
interface DevItem {
  id: string;
  title: string;
  type: "snippet" | "command" | "link" | "note";
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
```

---

## Exemplo de itens úteis

### Comando

```json
{
  "title": "Ver portas abertas no Linux",
  "type": "command",
  "content": "sudo lsof -i -P -n | grep LISTEN",
  "tags": ["linux", "terminal", "debug"]
}
```

### Snippet

```json
{
  "title": "Fetch com tratamento básico",
  "type": "snippet",
  "content": "const res = await fetch(url); if (!res.ok) throw new Error('Request failed');",
  "tags": ["javascript", "fetch", "api"]
}
```

### Link

```json
{
  "title": "Documentação do Deno",
  "type": "link",
  "content": "https://docs.deno.com/",
  "tags": ["deno", "docs"]
}
```

### Nota

```json
{
  "title": "Diferença entre PATCH e PUT",
  "type": "note",
  "content": "PATCH atualiza parcialmente um recurso. PUT normalmente substitui o recurso inteiro.",
  "tags": ["http", "rest", "api"]
}
```

---

## Objetivo do projeto

Este projeto foi criado para praticar desenvolvimento de APIs REST com uma stack
moderna e enxuta, sem depender de um ecossistema pesado.

Além de servir como exercício técnico, a API também pode ser usada como base
para uma ferramenta pessoal de produtividade para desenvolvedores.

---

## Possíveis melhorias

- Autenticação por API key
- Favoritar itens importantes
- Exportação em Markdown ou JSON
- Importação de backup
- Testes automatizados
- Paginação
- Ordenação por data, tipo ou tag
- Frontend simples para uso no navegador
- Deploy no Deno Deploy

---

## Autor

Feito por **João Matheus** como projeto de estudo e prática com Deno, Hono e
APIs REST.

````
Uma versão mais “bonita” para GitHub também poderia ter badges no topo:

```md
![Deno](https://img.shields.io/badge/Deno-000?style=for-the-badge&logo=deno&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Hono](https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=hono&logoColor=white)
````

Eu colocaria esses badges logo abaixo do título, assim:

```md
```
