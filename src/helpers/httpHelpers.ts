import { Request, Response } from "express";

export function httpTestSession(req: Request, res: Response): Boolean {
  if (req.session == null) {
    res.sendStatus(500);
    return false;
  }

  return true;
}
