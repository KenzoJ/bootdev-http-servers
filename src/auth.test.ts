import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "./auth.js";
import { checkPasswordHash, hashPassword } from "./auth.js";

describe("Password hashing", () => {
  const pass1 = "correctpass123";
  const pass2 = "incorrpass123";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(pass1);
    hash2 = await hashPassword(pass2);
  });

  it("should return true for correct password", async () => {
    const result = await checkPasswordHash(pass1, hash1);
    expect(result).toBe(true)
  });

  it("should return false for incorrect password", async () => {
    const result = await checkPasswordHash(pass1, hash2);
    expect(result).toBe(false)
  });
})

describe("JWT Funct", () => {
  const secret = "secret";
  const wrongSecret = "notsecret"
  const userId = "unique-id";
  let validToken: string;

  beforeAll(() => {
    validToken = makeJWT(userId, 3600, secret);
  });

  it("should validate valid token", () => {
    const result = validateJWT(validToken, secret);
    expect(result).toBe(userId)
  })
})
