import mongoose from "mongoose";

let conn: typeof mongoose;
let hasInit: boolean = false;

async function init() {
  const dbName = (() => {
    switch (process.env.EXPRESS_STATE!) {
      case "production":
        return "urlshortener"
      default:
        return "urlshortener_dev"
    };
  })();

  const connUrl = `${process.env.DATABASE_URL}/${dbName}` || "";
  console.log('Establishing connection to MongoDB Database... 🚀')
  conn = await mongoose.connect(connUrl);
  hasInit = true;
}

async function getConnection(): Promise<typeof mongoose> {
  try {
    if (!hasInit) await init();
    return conn;
  } catch (err: any) {
    throw new Error(`Error connecting to MongoDB Database due to ${err.message}.`);
  }
}

export default getConnection;