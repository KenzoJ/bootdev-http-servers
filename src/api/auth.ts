import { getUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, getBearerToken } from "../auth.js";
import { respondWithJSON } from "./json.js";
import { BadRequest, Forbidden, Unauthorized } from "./errors.js";
import { makeJWT } from "../auth.js";
import { config } from "../config.js";
import type { Request, Response } from "express";
import type { UserResponse } from "./users.js";
import { makeRefreshToken } from "../auth.js";
import { getUserFromRefreshToken, revokeToken } from "../db/queries/tokens.js";
import { NewRefreshToken } from "../db/schema.js";


type LoginResponse = UserResponse & {
  token: string;
  refreshToken: string;
}

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

  const token = makeJWT(user.id, config.secret);
  const refreshToken = makeRefreshToken(user.id)

  respondWithJSON(res, 200, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token: token,
    refreshToken: refreshToken,
  } satisfies LoginResponse);
}


export async function handlerRefreshToken(req: Request, res: Response) {
  const refreshToken = getBearerToken(req)

  if (!refreshToken) { throw new BadRequest("Token does not exist") }

  const user = await getUserFromRefreshToken(refreshToken)
  if (!user) { throw new BadRequest("no user has that token") }
  if (user.refresh_tokens.revokedAt || user.refresh_tokens.expiresAt < new Date()) {
    throw new Unauthorized("expired")
  }
  const token = makeJWT(user.users.id, config.secret);

  respondWithJSON(res, 200, {
    token: token
  })
}

export async function handlerRevokeToken(req: Request, res: Response) {
  const refreshToken = getBearerToken(req)

  if (!refreshToken) { throw new BadRequest("Token does not exist") }

  const user = await getUserFromRefreshToken(refreshToken)
  if (!user) { throw new BadRequest("no user has that token") }

  revokeToken(user.users.id)

  res.sendStatus(204)
}
