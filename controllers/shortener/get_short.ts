import { Response } from "express";
import getConnection from "../../db/connection";
import { DbCollectionName } from "../../utils/misc/enum";
import { urlShortSchema } from "../../db/schema";
import { sendError, sendSuccess } from "../../utils/misc/send";
import { RequestWithJsonAndJwt } from "../../interfaces/request_jsonjwt";

export default async function getShortLink(req: RequestWithJsonAndJwt, res: Response) {
  try {
    const db = await getConnection();
    const UrlShort = db.model(DbCollectionName.Shorts, urlShortSchema);

    const uriEntry = await UrlShort.findOne({
      short_uri: req!.data!['short_uri']
    });
    if (uriEntry === null) throw new Error("Link not found.");
    sendSuccess(res, {
      'created_date': uriEntry['createdDate'],
      'updated_date': uriEntry['updatedDate'],
      'short_uri': uriEntry['short_uri'],
      'long_uri': uriEntry['long_uri'],
      'author': uriEntry['author']
    });
  } catch (err: any) {
    if (err instanceof Error) {
      sendError(res, 404, 'Link not found.');
    }
  }
}