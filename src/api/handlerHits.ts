import { Request, Response } from "express";
import { config } from "./config.js";

export async function handlerHits(req: Request, res: Response) {
  res.set('Content-Type', 'text/plain; charset=utf-8')
    .status(200)
    .send(`Hits: ${config.fileserverHits}`)
}

