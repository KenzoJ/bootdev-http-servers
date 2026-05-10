import type { Request, Response } from "express";
import { respondWithError, respondWithJSON } from "./json.js";
import { createUser, getUser } from "../db/queries/users.js";
import { config } from "../config.js";
import { Forbidden } from "./errors.js";

export async function handlerUsersCreate(req: Request, res: Response) {
  type parameters = {
    email: string;
  };

  if (config.api.platform !== "dev") {
    throw new Forbidden("Not dev access")
  }

  const params: parameters = req.body;

  //check if user exists
  //const userExists = await getUser(params.email)
  //if (typeof userExists === "object") {
  //console.log("User already exists")
  //throw new Forbidden("User access")
  //}

  //create new if not
  const newUser = await createUser({ email: params.email });

  respondWithJSON(res, 201, newUser)

}
