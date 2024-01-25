import { Response } from "express";
import getConnection from "../../db/connection";
import { DbCollectionName } from "../../utils/misc/enum";
import { urlShortSchema } from "../../db/schema";
import { sendError, sendSuccess } from "../../utils/misc/send";
import { RequestWithJsonAndJwt } from "../../interfaces/request_jsonjwt";

export default async function editShortLink(req: RequestWithJsonAndJwt, res: Response) {
  try {
    const db = await getConnection();
    const UrlShort = db.model(DbCollectionName.Shorts, urlShortSchema);

    const uriEntry = await UrlShort.findOne({
      short_uri: req!.data!['short_uri']
    });

    if (uriEntry === null) throw new Error("not found");
    if (uriEntry.author != req!.token!['email']) throw new Error("unauthorized");

    const updatedTime = new Date();

    uriEntry.updatedDate = updatedTime;
    uriEntry.long_uri = req!.data!['long_uri'];

    uriEntry.save();

    sendSuccess(res, {
      "description": `Your short link '${req!.data!['short_uri']}' has been updated successfully.`
    });
  } catch (err: any) {
    if (err instanceof Error) {
      switch (err.message) {
        case "not found":
          sendError(res, 404, "Link not found.");
          return;
        case "unauthorized":
          sendError(res, 403, "Short link is not associated with your account.");
          return;
      }
      sendError(res, 503, "There is a problem within server, please try again later.");
    }
  }
}