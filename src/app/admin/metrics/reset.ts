import { Request, Response } from "express";
import { config } from "../../../config.js";
import { deleteUsers } from "../../../db/queries/users.js";

export async function handlerReset(req: Request, res: Response) {
  config.api.fileserverHits = 0;
  deleteUsers();
  res.write("Hits reset to 0. No users in DB");
  res.end();
}

