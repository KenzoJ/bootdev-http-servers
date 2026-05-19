import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash } from "../auth.js";
import { respondWithJSON } from "./json.js";
import { Unauthorized } from "./errors.js";

import type { Request, Response } from "express";
import type { UserResponse } from "./users.js";

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
  };

  const params: parameters = req.body;

  const user = await getUserByEmail(params.email);
  if (!user) {
    throw new Unauthorized("incorrect email or password");
  }

  const matching = await checkPasswordHash(
    params.password,
    user.hashedPassword,
  );
  if (!matching) {
    throw new Unauthorized("incorrect email or password");
  }

  respondWithJSON(res, 200, {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } satisfies UserResponse);
}

export function getBearerToken(req: Request): string {
  const header = req.app.get('Authorization');
  if (!header) {
    throw new Unauthorized("No auth");
  }
  const sanitized = header.slice(7)
  console.log(sanitized)
  return sanitized;
}
