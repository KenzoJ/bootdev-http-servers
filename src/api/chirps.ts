import type { Request, Response } from "express";
import { respondWithJSON } from "./json.js";
import { BadRequest } from "./errors.js";
import { createChirp } from "../db/queries/chirps.js";
import { NewChirp } from "../db/schema.js";
import { getUserById } from "../db/queries/users.js";

export type Parameters = {
  body: string;
  userId: string;
};

export async function handlerChirpsValidate(req: Request, res: Response) {

  const params: Parameters = req.body;

  if (!isParameters(req.body)) {
    throw new BadRequest("Need valid JSON")
  }

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    throw new BadRequest("Chirp is too long. Max length is 140")
  }
  const cleaned = checkProfanities(params.body)

  if (typeof getUserById(params.userId) === 'undefined') {
    throw new BadRequest("Unknown user by that Id")
  }

  const newChirp: NewChirp = await createChirp({
    body: cleaned,
    userId: params.userId
  })


  respondWithJSON(res, 201, newChirp)
}

function checkProfanities(input: string): string {
  const badWords = ["kerfuffle", "sharbert", "fornax"]

  const words = input.split(" ")
  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const lowWord = word.toLowerCase()
    if (badWords.includes(lowWord)) {
      words[i] = "****";
    }
  }
  return words.join(" ")
}

function isParameters(value: unknown): value is Parameters {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as any).body === 'string' &&
    typeof (value as any).userId === 'string'
  );
}
