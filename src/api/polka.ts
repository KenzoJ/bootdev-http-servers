import type { Request, Response } from "express";
import { BadRequest, NotFoundError } from "./errors.js";
import { upgradeChirp } from "../db/queries/users.js";
export async function handlerPolkaWebhook(req: Request, res: Response) {
  type parameters = {
    event: string;
    data: {
      userId: string;
    }
  };

  const params: parameters = req.body;

  const { event, data } = params;

  if (event !== "user.upgraded") {
    res.sendStatus(204)
  } else {
    const response = upgradeChirp(data.userId)
    if (!response) { throw new NotFoundError("user not found") }
    res.sendStatus(204)

  }


}
