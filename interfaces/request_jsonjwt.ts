import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface RequestWithJsonAndJwt extends Request {
  data?: Record<string, any>,
  token?: string | JwtPayload
}