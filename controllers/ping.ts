import { Request, Response } from "express";
import { sendSuccess } from "../utils/misc/send";

export default function ping(_: Request, res: Response) {
  sendSuccess(res, {
    'description': 'Pong!'
  });
};