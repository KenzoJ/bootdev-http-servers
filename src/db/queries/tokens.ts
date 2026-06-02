import { db } from "../index.js";
import { refreshTokens, users } from "../schema.js";
import { eq, exists } from 'drizzle-orm'

export async function addRefreshToken(refreshToken: string, user: string) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 60);
  const result = await db.insert(refreshTokens)
    .values({
      token: refreshToken,
      expiresAt,
      userId: user,
    }
    ).returning()
  return result;
}

export async function getUserFromRefreshToken(refreshToken: string) {
  const [result] = await db.select().from(refreshTokens)
    .innerJoin(users, eq(refreshTokens.userId, users.id))
    .where(eq(refreshTokens.token, refreshToken))
  return result
}

export async function revokeToken(userId: string) {
  const now = new Date()
  const [result] = await db.update(refreshTokens)
    .set({
      updatedAt: now,
      revokedAt: now
    })
    .where(eq(refreshTokens.userId, userId));
  return result;
}

