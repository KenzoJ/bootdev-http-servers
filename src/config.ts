import { envOrThrow } from "./helper.js"
import type { MigrationConfig } from "drizzle-orm/migrator";

type APIConfig = {
  port: number;
  fileserverHits: number;
  platform: string;
}
type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
}
type Config = {
  api: APIConfig,
  db: DBConfig
}

process.loadEnvFile()

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const config: Config = {
  api: {
    port: Number(envOrThrow(("PORT"))),
    fileserverHits: 0,
    platform: envOrThrow("PLATFORM")
  },
  db: {
    url: envOrThrow("DB_URL"),
    migrationConfig: migrationConfig,
  }
}

