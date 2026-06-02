import * as argon2 from "argon2";
import { BadRequest, Unauthorized } from "./api/errors.js";
import jwt, { JwtPayload } from "jsonwebtoken";
type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
import { addRefreshToken } from "./db/queries/tokens.js";
import { randomBytes } from "node:crypto";
import type { Request } from "express";

export async function hashPassword(password: string): Promise<string> {
  try {
    const result = await argon2.hash(password);
    return result;
  } catch (err) {
    throw new Error(`New error: ${err}`)
  }
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
  if (!password) return false;
  try {
    return await argon2.verify(hash, password)
  } catch {
    return false
  }
}

export function validateJWT(tokenString: string, secret: string): string {
  //console.log(tokenString, "tokenstring:")
  let decoded: payload;
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (err) {
    throw new Unauthorized("Invalid token")
  }
  if (decoded.iss !== "chirpy") {
    throw new Unauthorized("Invalid issuer")
  }
  if (!decoded.sub) {
    throw new Unauthorized("No user Id in token")
  }
  return decoded.sub
}

export function makeRefreshToken(userId: string) {
  const buf = randomBytes(256);
  const token = buf.toString("hex");
  addRefreshToken(token, userId)
  return token;
}
//

export function makeJWT(userID: string, secret: string): string {
  const issuesAt = Math.floor(Date.now() / 1000)
  const expiresAt = issuesAt + 3600;
  const token = jwt.sign({
    iss: "chirpy",
    sub: userID,
    iat: issuesAt,
    exp: expiresAt,
  } satisfies payload,
    secret,
    { algorithm: "HS256" },
  )
  return token;
}

export function getBearerToken(req: Request): string {
  const header = req.get('Authorization');
  if (!header) {
    throw new Unauthorized("No auth");
  }
  const sanitized = header.replace("Bearer ", "").trim()
  return sanitized;
}

export function getAPIKey(req: Request) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throw new Unauthorized("Malformed authorization header");
  }

  return extractApiKey(authHeader);
}

export function extractApiKey(header: string) {
  const splitAuth = header.split(" ");
  if (splitAuth.length < 2 || splitAuth[0] !== "ApiKey") {
    throw new BadRequest("Malformed authorization header");
  }
  return splitAuth[1];
}

