import { Response } from "express";
import { sendError, sendSuccess } from "../../utils/send";
import getConnection from "../../db/connection";
import { userSchema } from "../../db/schema";
import getCurrentDate from "../../utils/date";
import { DbCollectionName, UserRole } from "../../utils/enum";
import { encryptPassword } from "../../utils/bcrypt";
import { RequestWithJsonAndJwt } from "../../interfaces/request_jsonjwt";

export default async function signup(req: RequestWithJsonAndJwt, res: Response) {
  try {
    const user = (await getConnection()).model(DbCollectionName.Users, userSchema);
    const currentTime = getCurrentDate();

    const newUser = new user({
      createdDate: currentTime,
      updatedDate: currentTime,
      email: req!.data!['email'],
      password: await encryptPassword(req!.data!['password']),
      role: UserRole.USER_MEMBER
    });

    await newUser.save();

    sendSuccess(res, {
      'message': "User has successfully registered. You can proceed to login!"
    });
  } catch (err: any) {
    if (typeof err === 'object') {
      // Key conflict, email exists, return error
      sendError(res, 409, 'Email exists, please use another email.');
    } else if (err instanceof Error) {
      sendError(res, 503, 'There is a problem within the server, please try again later.');
    }
  }
}