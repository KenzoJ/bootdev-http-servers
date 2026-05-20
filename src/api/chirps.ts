import type { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { BadRequest, Forbidden, NotFoundError } from "./errors.js";
import { getChirp, createChirp, getAllPosts } from "../db/queries/chirps.js";
import { NewChirp } from "../db/schema.js";
import { getUserById } from "../db/queries/users.js";
import { getBearerToken } from "./auth.js";
import { validateJWT } from "../auth.js";
import { config } from "../config.js";



export type Parameters = {
  body: string;
};

export async function handlerChirpsCreate(req: Request, res: Response) {

  const bearerToken = getBearerToken(req)
  const userId = validateJWT(bearerToken, config.secret);

  const params: Parameters = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    throw new BadRequest("Chirp is too long. Max length is 140")
  }
  const cleaned = checkProfanities(params.body)

  const newChirp: NewChirp = await createChirp({
    body: cleaned,
    userId: userId
  })


  respondWithJSON(res, 201, newChirp)
}

export async function handlerGetAllChirps(_: Request, res: Response) {
  const allPosts = await getAllPosts()

  if (typeof allPosts === 'undefined') {
    throw new Forbidden("No posts to get")
  }

  for (let i = 0; allPosts.length < i; i++) {
    console.log(allPosts[i])
  }

  respondWithJSON(res, 200, allPosts)
}

export async function handlerGetChirp(req: Request, res: Response) {
  const { chirpId } = req.params;

  if (typeof chirpId !== "string") {
    throw new BadRequest("Invalid chirp id")
  }

  const chirp = await getChirp(chirpId);

  if (!chirp) {
    throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
  }
  respondWithJSON(res, 200, chirp)
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
    typeof (value as any).body === 'string'
  );
}

