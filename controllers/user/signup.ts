import { Response } from "express";
import { sendError, sendSuccess } from "../../utils/misc/send";
import getConnection from "../../db/connection";
import { userSchema } from "../../db/schema";
import getCurrentDate from "../../utils/misc/date";
import { DbCollectionName, UserRole } from "../../utils/misc/enum";
import { encryptPassword } from "../../utils/encryption/bcrypt";
import { RequestWithJsonAndJwt } from "../../interfaces/request_jsonjwt";
import crypto from 'crypto';
import sendEmail from "../../utils/email/smtp_mailer";

export default async function signup(req: RequestWithJsonAndJwt, res: Response) {
  try {
    const user = (await getConnection()).model(DbCollectionName.Users, userSchema);
    const currentTime = getCurrentDate();

    const newUser = new user({
      createdDate: currentTime,
      updatedDate: currentTime,
      email: req!.data!['email'],
      password: await encryptPassword(req!.data!['password']),
      role: UserRole.USER_MEMBER,
      isVerified: false,
      verifyPayload: crypto.randomBytes(48).toString('hex')
    });

    await newUser.save();

    sendEmail({
      to: req!.data!['email'],
      subject: 'URL Shortener Verification',
      message: `http://localhost:8080/verify?payload=${newUser.verifyPayload}`,
    });

    sendSuccess(res, {
      'description': "User has successfully registered. Please check your email for verification."
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