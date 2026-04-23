import type { Request, Response } from "express";

import { respondWithJSON, respondWithError } from "./json.js";

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
    respondWithError(res, 400, "Chirp is too long");
    return;
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

