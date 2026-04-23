import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { NotFoundError, Unauthorized, BadRequest, Forbidden } from "./errors.js";
import { respondWithError } from "./json.js";

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

export async function errorMiddleware(
  err: Error,
  __: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let message = "Something went wrong on the server"

  if (err instanceof BadRequest) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof Unauthorized) {
    statusCode = 401;
    message = err.message;
  } else if (err instanceof Forbidden) {
    statusCode = 403;
    message = err.message;
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
    message = err.message;
  }

  if (statusCode >= 500) {
    console.log(err.message);
  }
  respondWithError(res, statusCode, message)
}

