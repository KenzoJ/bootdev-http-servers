import { Request, Response, NextFunction } from "express";
import { config } from "./config.js"

export async function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    const status = res.statusCode;
    if (status < 200 || status > 299) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`)
    }
  })
  next()
}

export async function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  console.log("middleware runs!");
  config.fileserverHits++;
  console.log(`File Server Hits: ${config.fileserverHits}`)
  next();
}

