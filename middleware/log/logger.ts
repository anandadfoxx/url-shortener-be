import { Request, Response } from "express";

export default function log(req: Request, _: Response, next: Function): void {
  console.log(`${req.method} | ${req.socket.remoteAddress} | ${(new Date()).toISOString()}`);
  next();
}