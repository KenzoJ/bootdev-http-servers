import { db } from "../index.js";
import { NewRefreshToken, refreshTokens } from "../schema.js";
import { eq, exists } from 'drizzle-orm'

export async function addRefreshToken(refreshToken: string) {
  const now = new Date();
  const exp = now.setMonth(2)
  const result = await db.insert(refreshTokens)
    .values([{ token: refreshToken }, { expiresAt: exp }]).returning()
  return result;
}

export async function getUserFromRefreshToken(userId: string) {
  const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.userId, userId))
  return result
}

export async function checkValidRefreshToken(token: string) {

  const result = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token))

  if (!result) {
    return true;
  } else {
    return false;
  }
} 
