import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../../utils/send';
import UserRole from '../../utils/enum';

export default function authorize(role: UserRole) {
  return function(req: Request, res: Response, next: NextFunction) {
    try {
      const requestToken: string = req.headers['Authorization'.toLowerCase()] as string;
      if (!requestToken) throw new Error("Invalid or unknown token.")

      const jwtResult: jwt.JwtPayload = jwt.verify(requestToken.slice('Bearer '.length), process.env.JWT_SECRET!) as jwt.JwtPayload;
      if (jwtResult['role'] > role) throw new Error("You are not authorized.");
      next();
    } catch (err: any) {
      if (err instanceof Error) {
        sendError(res, 403, err.message);
      }
    }
  }
  
}