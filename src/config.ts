import { envOrThrow } from "./helper.js"
import type { MigrationConfig } from "drizzle-orm/migrator";

type APIConfig = {
  port: number;
  fileserverHits: number;
  platform: string;
  polkaKey: string;
}
type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
}
type Config = {
  api: APIConfig,
  db: DBConfig,
  secret: string
}

process.loadEnvFile()

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const config: Config = {
  api: {
    port: Number(envOrThrow(("PORT"))),
    fileserverHits: 0,
    platform: envOrThrow("PLATFORM"),
    polkaKey: envOrThrow("POLKA_KEY")
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  },
  secret: envOrThrow("SECRET")
}

