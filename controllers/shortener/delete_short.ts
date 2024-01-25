import { Response } from "express";
import { RequestWithJsonAndJwt } from "../../interfaces/request_jsonjwt";
import { sendError, sendSuccess } from "../../utils/misc/send";
import getConnection from "../../db/connection";
import { DbCollectionName } from "../../utils/misc/enum";
import { urlShortSchema } from "../../db/schema";

export default async function deleteShortLink(req: RequestWithJsonAndJwt, res: Response) {
  try {
    const db = await getConnection();
    const Shortener = db.model(DbCollectionName.Shorts, urlShortSchema);

    const uriEntry = await Shortener.findOne({
      short_uri: req!.data!['short_uri']
    });
    
    if (uriEntry === null) throw new Error("not found");
    if (uriEntry.author != req!.token!['email']) throw new Error("unauthorized");

    await uriEntry.deleteOne();
    
    sendSuccess(res, {
      "description": `Short link '${req!.data!['short_uri']}' has been deleted successfully.`
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      switch (err.message) {
        case "not found":
          sendError(res, 404, "Link not found.");
          return;
        case "unauthorized":
          sendError(res, 403, "Short link is not associated with your account.");
          return;
      }
    }
  }
}