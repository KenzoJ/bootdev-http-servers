import * as argon2 from "argon2";
import { Unauthorized } from "./api/errors.js";
import jwt, { JwtPayload } from "jsonwebtoken";
type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

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
//

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
  const issuesAt = Math.floor(Date.now() / 1000)
  const expiresAt = issuesAt + expiresIn;
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


