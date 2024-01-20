import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../../utils/send';
import {UserRole} from '../../utils/enum';
import { RequestWithJsonAndJwt } from '../../interfaces/request_jsonjwt';

export default function authorize(role: UserRole) {
  return function(req: RequestWithJsonAndJwt, res: Response, next: NextFunction) {
    try {
      const requestToken: string = req.headers['Authorization'.toLowerCase()] as string;      
      req.token = jwt.verify(requestToken.slice('Bearer '.length), process.env.JWT_SECRET!) as jwt.JwtPayload;
      if (req.token['role'] > role) throw new Error("You are not authorized.");
      next();
    } catch (err: any) {
      sendError(res, 403, "Invalid or expired token.");
    }
  }
}