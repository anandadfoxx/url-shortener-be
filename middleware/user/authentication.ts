import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../../utils/misc/send';
import { RequestWithJsonAndJwt } from '../../interfaces/request_jsonjwt';

export default function authenticate(req: RequestWithJsonAndJwt, res: Response, next: NextFunction) {
  try {
    const requestToken: string = req.headers['Authorization'.toLowerCase()] as string;
    // Perform routes when authenticated
    req.token = jwt.verify(requestToken.slice('Bearer '.length), process.env.JWT_SECRET as string) as jwt.JwtPayload;
    next();
  } catch (err: any) {
    if (err instanceof Error) {
      sendError(res, 403, "Invalid or expired token.");
    }
  }
}