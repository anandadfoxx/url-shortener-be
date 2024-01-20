import { Response } from "express";

export function sendSuccess(res: Response, data: object) {
  res.status(200).json(Object.assign({ 'success': true }, data));
}

export function sendError(res: Response, errorCode: number, msg: string) {
  res.status(errorCode).json({
    'success': false,
    'description': msg
  });
};