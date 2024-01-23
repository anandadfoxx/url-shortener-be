import { Response } from "express";
import { sendError, sendSuccess } from "../../utils/misc/send";
import getConnection from "../../db/connection";
import { userSchema } from "../../db/schema";
import { verifyPassword } from "../../utils/encryption/bcrypt";
import jwt from 'jsonwebtoken';
import { DbCollectionName } from "../../utils/misc/enum";
import { RequestWithJsonAndJwt } from "../../interfaces/request_jsonjwt";

export default async function login(req: RequestWithJsonAndJwt, res: Response) {
  try {
    const db = (await getConnection()).model(DbCollectionName.Users, userSchema);

    const user = await db.findOne({
      email: req!.data!['email']
    });
    if (!user) throw new Error("");
    if (!await verifyPassword(req!.data!['password'], user.password!)) throw new Error("");
    if (!user.isVerified) throw new Error("not verified");

    // Login success, create JWT for next 6 hours
    const token = jwt.sign({
      email: user.email!,
      role: user.role!
    },
      process.env.JWT_SECRET!,
      {
        expiresIn: "6h"
      }
    )

    sendSuccess(res, {
      'token': token
    })
  } catch (err: any) {
    switch ((err as Error).message) {
      case "not verified":
        sendError(res, 403, "Your account has not been verified, please check your email.");
        break;
      default:
        sendError(res, 400, "Email or password invalid, please check your input.");
        break;
    }
  }
}