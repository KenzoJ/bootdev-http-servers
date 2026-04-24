import type { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { config } from "../config.js";
import { Forbidden } from "./errors.js";

export async function handlerUsers(req: Request, res: Response) {
  type parameters = {
    email: string;
  };

  const params: parameters = req.body;

  const newUser = await createUser({ email: params.email });

  console.log(newUser)

  if (config.api.platform !== "dev") {
    throw new Forbidden("Not dev access")
  }

  respondWithJSON(res, 201, {
    id: newUser.id,
    email: newUser.email,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt
  }
  )

}
