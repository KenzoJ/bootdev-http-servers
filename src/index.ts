import express from "express";
import { handlerReadiness } from "./api/readiness.js"
import { middlewareMetricsInc, middlewareLogResponses, errorMiddleware } from "./api/middleware.js"
import { handlerHits } from "./app/admin/metrics/index.js";
import { handlerReset } from "./app/admin/metrics/reset.js"
import { handlerChirpsValidate } from "./api/chirps.js";

const app = express();
const PORT = 8080;

app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.use(middlewareLogResponses);
app.use(express.json())

//API
app.use("/api", express.static("./src/api"));
app.get("/api/healthz", handlerReadiness);
//app.post("/api/validate_chirp", handlerChirpsValidate)
app.post("/api/validate_chirp", async (req, res, next) => {
  try {
    await handlerChirpsValidate(req, res);
  } catch (err) {
    next(err)
  }
})

//ADMIN
app.get("/admin/metrics", handlerHits);
app.post("/admin/reset", handlerReset)

//Error handling
app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
