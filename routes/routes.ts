import express, { Express } from 'express';
import ping from '../controllers/ping';
import log from '../middleware/log/logger';
import cors from 'cors';
import bindBodyOrError from '../middleware/bind';
import UserParams from '../parameters/user';

const app: Express = express();

app.use(log);
app.use(cors());
app.use(express.json());

app.post('/ping', bindBodyOrError(UserParams), ping);

export default app;