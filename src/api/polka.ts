import type { Request, Response } from "express";
import { BadRequest, NotFoundError, Unauthorized } from "./errors.js";
import { upgradeChirp } from "../db/queries/users.js";
import { getAPIKey } from "../auth.js";
import { config } from "../config.js";

export async function handlerPolkaWebhook(req: Request, res: Response) {
  type parameters = {
    event: string;
    data: {
      userId: string;
    }
  };

  const params: parameters = req.body;

  const { event, data } = params;

  console.log(config.api.polkaKey, "polka")
  let api = getAPIKey(req);

  if (api !== config.api.polkaKey) {
    throw new Unauthorized("Not authorized")
  }

  if (event !== "user.upgraded") {
    res.sendStatus(204)
  } else {
    const response = upgradeChirp(data.userId)
    console.log(response)
    if (!response) { throw new NotFoundError("user not found") }
    res.sendStatus(204)
  }
}
