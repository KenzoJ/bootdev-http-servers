import express from "express";
import { handlerReadiness } from "./api/readiness.js"
import { middlewareMetricsInc, middlewareLogResponses, errorMiddleware } from "./api/middleware.js"
import { handlerHits } from "./app/admin/metrics/index.js";
import { handlerReset } from "./app/admin/metrics/reset.js"
import { handlerLogin } from "./api/auth.js";
import { handlerUsersCreate } from "./api/users.js"
import { handlerGetChirp, handlerChirpsCreate, handlerGetAllChirps } from "./api/chirps.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";


const app = express();

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);
app.use(express.json())

//API
app.use("/api", express.static("./src/api"));
app.post("/api/users", async (req, res, next) => {
  try {
    await handlerUsersCreate(req, res);
  } catch (err) {
    next(err)
  }
})
app.post("/api/login", (req, res, next) => {
  Promise.resolve(handlerLogin(req, res)).catch(next);
});
app.get("/api/healthz", handlerReadiness);
app.post("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerChirpsCreate(req, res)).catch(next);
});
app.get("/api/chirps", (req, res, next) => {
  Promise.resolve(handlerGetAllChirps(req, res)).catch(next);
});
app.get("/api/chirps/:chirpId", (req, res, next) => {
  Promise.resolve(handlerGetChirp(req, res)).catch(next)
})

//ADMIN
app.get("/admin/metrics", handlerHits);
app.post("/admin/reset", handlerReset)

//Error handling
app.use(errorMiddleware)

app.listen(config.api.port, () => {
  console.log(`Server is running at http://localhost:${config.api.port}`);
});
