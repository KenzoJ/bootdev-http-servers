import type { Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import { BadRequest } from "./errors.js";

export async function handlerChirpsValidate(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  const params: parameters = req.body;

  const maxChirpLength = 140;
  if (params.body.length > maxChirpLength) {
    throw new BadRequest("Chirp is too long. Max length is 140")
  }
  const clearedBody = checkProfanities(params.body)

  respondWithJSON(res, 200, {
    cleanedBody: clearedBody,
  }
  )
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

