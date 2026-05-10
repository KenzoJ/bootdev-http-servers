# HTTP servers (Boot.dev)

Boot dev's assignment on building HTTP servers using [Express](https://expressjs.com/) API with PostgreSQL via [Drizzle ORM](https://orm.drizzle.team/). 

On startup, the server runs database migrations, then serves REST endpoints for users and chirps plus a small static app under `/app`.

## Prerequisites

- **Node.js** — see `.nvmrc` (e.g. `nvm use`)
- **PostgreSQL** — connection string available as `DB_URL`

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with:

   | Variable   | Description                          |
   | ---------- | ------------------------------------ |
   | `PORT`     | HTTP port for the API                |
   | `PLATFORM` | Platform identifier (app config)       |
   | `DB_URL`   | PostgreSQL connection URL            |

3. Build and run:

   ```bash
   npm run dev
   ```

   The server prints its URL on startup (for example `http://localhost:<PORT>`).

## Scripts

| Script      | What it does                                      |
| ----------- | ------------------------------------------------- |
| `npm run dev` | Compile TypeScript (`tsc`) and run `dist/index.js` |
| `npm run build` | Compile only                                      |
| `npm start`     | Run compiled output (`node dist/index.js`)        |
| `npm run generate` | Generate Drizzle migrations (`drizzle-kit`)   |
| `npm run migrate`  | Apply migrations via Drizzle Kit                |

## API overview

- `GET /api/healthz` — readiness check  
- `POST /api/users` — create user  
- `GET /api/chirps` — list chirps  
- `POST /api/chirps` — create chirp  
- `GET /api/chirps/:chirpId` — get one chirp  
- `GET /admin/metrics` — admin metrics  
- `POST /admin/reset` — admin reset  

Static files: `/app` (and `/api` static mount for development assets as wired in `src/index.ts`).
