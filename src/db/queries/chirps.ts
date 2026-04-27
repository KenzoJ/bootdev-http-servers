import { db } from "../index.js";
import { chirps, NewChirp } from "../schema.js";
//import { eq } from 'drizzle-orm'

export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return result;
}

//export async function deleteUsers() {
//  const result = await db.delete(users);
//  return result;
//}

//export async function getUser(email: string) {
//  const [result] = await db.select().from(users).where(eq(users.email, email))
//
//  return result;
//}
