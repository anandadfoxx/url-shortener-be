import { Request, Response } from "express";
import { sendSuccess } from "../utils/send";
import bindBodyOrError from "../middleware/bind";
import UserParams from "../parameters/user";

export default function ping(_: Request, res: Response) {
  sendSuccess(res, {
    'message': 'Pong!',
    'data': res.locals['body'],
  });
};