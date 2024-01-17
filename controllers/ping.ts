import { Request, Response } from "express";
import { sendSuccess } from "../utils/send";

export default function ping(req: Request, res: Response) {
  sendSuccess(res, {
    'message': 'Pong!'
  });
};