import { Response } from "express";
import getConnection from "../../db/connection";
import { userSchema } from "../../db/schema";
import { RequestWithJsonAndJwt } from "../../interfaces/request_jsonjwt";
import { DbCollectionName } from "../../utils/misc/enum";
import { sendError, sendSuccess } from "../../utils/misc/send";

export default async function verifyAccount(req: RequestWithJsonAndJwt, res: Response) {
  try {
    const db = await getConnection();
    const User = db.model(DbCollectionName.Users, userSchema);

    const verifyUser = await User.findOne({
      verifyPayload: req!.data!['payload']
    });

    if (!verifyUser) {
      throw new Error("400");
    }

    if (verifyUser.isVerified) {
      throw new Error("410");
    }

    // then perform the account verify
    verifyUser.isVerified = true;
    verifyUser.verifyPayload = undefined;
    verifyUser.save();

    sendSuccess(res, {
      "description": "Your account has been verified successfully, you can proceed to login."
    })
  } catch(err: any) {
    if (err instanceof Error) {
      switch (err.message) {
        case "400":
          sendError(res, 400, "Invalid or unknown verification token.");
          break;
        case "410":
          sendError(res, 410, "You are already verified.");
          break;
      }
    }
  }
}