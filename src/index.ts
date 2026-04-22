import express from "express";
import { handlerReadiness } from "./api/readiness.js"
import { middlewareMetricsInc, middlewareLogResponses } from "./api/middleware.js"
import { handlerHits } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js"

const app = express();
const PORT = 8080;

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);
app.get("/healthz", handlerReadiness);
app.get("/metrics", handlerHits);
app.get("/reset", handlerReset)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

