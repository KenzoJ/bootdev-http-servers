import * as argon2 from "argon2";
import { Unauthorized } from "./api/errors.js";

export async function hashPassword(password: string): Promise<string> {
  try {
    const result = await argon2.hash(password);
    return result;
  } catch (err) {
    throw new Error(`New error: ${err}`)
  }
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
  try {
    if (await argon2.verify(hash, password)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new Unauthorized("incorrect email or password")
  }
}
