import { NextFunction, Request, RequestHandler, Response } from "express";
import { sendError } from "../utils/send";
import ParameterOptions from "../interfaces/parameter";

export default function bindBodyOrError(params?: ParameterOptions[]): RequestHandler {
  return function(req: Request, res: Response, next: NextFunction) {
    let body: object;
    switch (req.method) {
      case 'GET':
        body = req.query;
        break;
      case 'DELETE':
        body = req.query;
        break;
      default:
        // POST and PUT method, parse the request body
        body = req.body;
        break;
    }

    let invalidParams: string[] = [];
    
    params?.forEach((key: ParameterOptions) => {
      if ((body as Record<string, any>)[key.param] === null || (body as Record<string, any>)[key.param] === undefined) {
        if (!key.emptyable) {
          invalidParams.push(key.param);
        } else {
          (body as Record<string, any>)[key.param] = key.defaultValue;
        }
      }
    });
    
    if (invalidParams.length > 0) {
      sendError(res, 400, `Missing value of ${invalidParams.join(', ')}`);
      return;
    }
    
    req.data = body;
    next();
  }
}