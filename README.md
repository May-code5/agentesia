# Luna Desk — Atencion multicanal con IA

**Luna Desk** es un MVP de inbox white-label con agentes de IA para WhatsApp, Instagram, Web, Email y Llamadas. Producto de **MAY-CODE** (Lima, Peru — [maycodestudio.com](https://maycodestudio.com)).

## Que es

Una plataforma de atencion al cliente donde:

- Todas las conversaciones llegan a un **inbox unificado**
- Un agente IA (**Luna**) responde con prompt, tono y FAQ configurables
- Puedes **tomar el control humano** en cualquier momento
- Hay stubs de webhooks listos para conectar Meta y otros canales
- El **widget web** funciona siempre (modo mock en espanol si no hay API key)

## Requisitos

- Node.js 18+
- npm

## Instalacion

```bash
cd /workspace/maycode-atencion-ia
cp .env.example .env
npm install
npx prisma db push
npm run db:seed
```

## Como correr

```bash
npm run dev
```

Abre http://localhost:3000

- Landing: `/`
- Login / demo: `/login`
- Inbox: `/dashboard`
- Agentes: `/dashboard/agentes`
- Ajustes: `/dashboard/ajustes`
- Widget: `/widget`

### Credenciales demo

- Email: `admin@maycode.pe`
- Contrasena: `demo1234`
- O pulsa **Entrar al demo**

### Scripts

| Script | Descripcion |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm start` | Servidor de produccion |
| `npm run db:push` | Sincroniza schema Prisma a SQLite |
| `npm run db:seed` | Carga workspace, Luna y conversaciones de ejemplo |

## Variables de entorno

Ver `.env.example`:

- `DATABASE_URL` — SQLite (`file:./dev.db` relativo a `prisma/`)
- `DEMO_SECRET` / `NEXTAUTH_SECRET` — firma de cookies de sesion
- `OPENAI_API_KEY` (opcional) — respuestas reales via OpenAI
- `ANTHROPIC_API_KEY` (opcional) — respuestas reales via Anthropic
- `NEXT_PUBLIC_APP_URL` (opcional) — URL publica para mostrar webhooks

Sin API keys de IA, el widget usa **modo mock** con respuestas inteligentes en espanol.

## Como conectar WhatsApp (pasos altos)

1. Crea una app en Meta for Developers y activa WhatsApp.
2. Configura el webhook hacia: `https://TU_DOMINIO/api/webhooks/whatsapp`
3. Verify token: por defecto `luna-desk-verify` (o `WHATSAPP_VERIFY_TOKEN` en `.env`).
4. Suscribe el campo `messages`.
5. En produccion, completa el envio outbound con el token de Meta (este MVP crea la conversacion inbound como stub).

Endpoints stub adicionales:

- `POST/GET /api/webhooks/instagram`
- `POST/GET /api/webhooks/email`
- `POST/GET /api/webhooks/voice`

## Como adaptar a un cliente MAY-CODE

1. Cambia branding (colores en `tailwind.config.ts`, textos en landing).
2. Crea un workspace nuevo (o edita el seed) con nombre/slug del cliente.
3. Ajusta el agente: system prompt, FAQ markdown y reglas de handoff.
4. Configura `NEXT_PUBLIC_APP_URL` y webhooks del cliente.
5. Opcional: anade claves de OpenAI o Anthropic para respuestas reales.
6. Despliega (Vercel, VPS, etc.) con SQLite o migra a Postgres cambiando el provider en Prisma.

## Stack

- Next.js App Router + TypeScript + Tailwind
- Prisma + SQLite
- Sesion demo firmada con cookies (HMAC)
- UI propia estilo shadcn (componentes limpios)

## Estructura

```
src/app          — paginas y API routes
src/components   — UI, inbox, agentes, layout
src/lib          — auth, db, ai, channels, agents
prisma           — schema + seed
```

## Licencia

Codigo original para MAY-CODE. Uso interno / clientes del estudio.
