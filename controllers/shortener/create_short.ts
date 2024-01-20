import { Response } from "express";
import getConnection from "../../db/connection";
import { DbCollectionName } from "../../utils/enum";
import { urlShortSchema } from "../../db/schema";
import { sendError, sendSuccess } from "../../utils/send";
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
      long_uri: req!.data!['long_uri']
    });

    sendSuccess(res, {
      "message": `${req!.data!['short_uri']} has been created.`
    });
  } catch (err: any) {
    sendError(res, 503, "There is a problem with the server, please try again later.");
  }
}