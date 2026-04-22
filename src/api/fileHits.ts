import { Request, Response, NextFunction } from "express";
import { config } from "./config.js"

export async function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  console.log("middleware runs!");
  config.fileserverHits++;
  console.log(`File Server Hits: ${config.fileserverHits}`)
  next();
}

