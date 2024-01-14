import getConnection from "./db/connection";
import app from "./routes/routes";
import dotenv from 'dotenv';  

// Load .env
dotenv.config();

// Init database
// getConnection().then(() => console.log('🖥 MongoDB Connected Successfully.'));

// Init server
const port: number = (process.env.PORT) ? parseInt(process.env.PORT) : 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})