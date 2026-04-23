import express from "express";
import { handlerReadiness } from "./api/readiness.js"
import { middlewareMetricsInc, middlewareLogResponses } from "./api/middleware.js"
import { handlerHits } from "./app/admin/metrics/index.js";
import { handlerReset } from "./app/admin/metrics/reset.js"
import { handlerChirpsValidate } from "./api/chirps.js";

const app = express();
const PORT = 8080;

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);

//API
app.use("/api", express.static("./src/api"));
app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerChirpsValidate)

//ADMIN
app.get("/admin/metrics", handlerHits);
app.post("/admin/reset", handlerReset)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

