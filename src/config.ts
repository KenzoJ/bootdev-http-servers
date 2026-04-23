import { envOrThrow } from "./helper.js"

process.loadEnvFile()

type APIConfig = {
  dbURL: string;
  fileserverHits: number;
}

const dbUrlConfirmed: string = envOrThrow("DB_URL")

export let config: APIConfig = {
  dbURL: dbUrlConfirmed,
  fileserverHits: 0,
}
