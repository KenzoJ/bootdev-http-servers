import { db } from "../index.js";
import { asc } from "drizzle-orm"
import { chirps, NewChirp } from "../schema.js";
import { eq } from 'drizzle-orm'

export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return result;
}
export async function getAllPosts() {
  return db.select().from(chirps).orderBy(asc(chirps.createdAt))
}

export async function getChirp(id: string) {
  const rows = await db.select().from(chirps).where(eq(chirps.id, id))
  if (rows.length === 0) {
    return;
  }
  return rows[0]
}
