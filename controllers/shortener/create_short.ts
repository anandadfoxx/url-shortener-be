import { Response } from "express";
import getConnection from "../../db/connection";
import { DbCollectionName } from "../../utils/misc/enum";
import { urlShortSchema } from "../../db/schema";
import { sendError, sendSuccess } from "../../utils/misc/send";
import { RequestWithJsonAndJwt } from "../../interfaces/request_jsonjwt";

export default async function createShortLink(req: RequestWithJsonAndJwt, res: Response) {
  try {
    const db = await getConnection();
    const UrlShort = db.model(DbCollectionName.Shorts, urlShortSchema);

    const createTime = new Date();
    await UrlShort.create({
      createdDate: createTime,
      updatedDate: createTime,
      short_uri: req!.data!['short_uri'],
      long_uri: req!.data!['long_uri'],
      author: req!.token!['email']
    });

    sendSuccess(res, {
      "description": `Your short link '${req!.data!['short_uri']}' has been created.`
    });
  } catch (err: any) {
    if (err instanceof Error) {
      // Check if the error is existed short link
      if (typeof err.message.match("^E11000") !== null) {
        sendError(res, 409, `Requested short link '${req!.data!['short_uri']}' already exist, please request another short link.`);
        return;
      }
      sendError(res, 503, "There is a problem within server, please try again later.");
    }
  }
}