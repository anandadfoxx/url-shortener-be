import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../../utils/send';

export default function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const requestToken: string = req.headers['Authorization'.toLowerCase()] as string;
    if (!requestToken) throw new Error("Invalid or unknown token.")
    // Perform routes when authenticated
    const jwtResult = jwt.verify(requestToken.slice('Bearer '.length), process.env.JWT_SECRET as string);
    next();
  } catch (err: any) {
    if (err instanceof Error) {
      sendError(res, 403, err.message);
    }
  }
}