import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash } from "../auth.js";
import { respondWithJSON } from "./json.js";
import { Unauthorized } from "./errors.js";
import { makeJWT } from "../auth.js";
import { config } from "../config.js";
import { randomBytes } from "node:crypto";
import type { Request, Response } from "express";
import type { UserResponse } from "./users.js";
import { addRefreshToken } from "../db/queries/tokens.js";


type LoginResponse = UserResponse & {
  token: string;
  refreshToken: string;
}

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
    expiresInSeconds?: number;
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

  const token = makeJWT(user.id, config.secret);
  const refreshToken = makeRefreshToken()

  respondWithJSON(res, 200, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token: token,
    refreshToken: refreshToken,
  } satisfies LoginResponse);
}

export function getBearerToken(req: Request): string {
  const header = req.get('Authorization');
  if (!header) {
    throw new Unauthorized("No auth");
  }
  const sanitized = header.replace("Bearer ", "").trim()
  return sanitized;
}

export function makeRefreshToken() {
  const buf = randomBytes(256);
  const token = buf.toString("hex");
  addRefreshToken(token)
  return token;
}
