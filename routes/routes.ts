import express, { Express } from 'express';
import ping from '../controllers/ping';
import log from '../middleware/log/logger';
import cors from 'cors';
import bindBodyOrError from '../middleware/bind';
import UserParams from '../parameters/user';
import login from '../controllers/user/login';
import signup from '../controllers/user/signup';
import authorize from '../middleware/user/authorization';
import authenticate from '../middleware/user/authentication';
import UserRole from '../utils/enum';

const app: Express = express();

app.use(log);
app.use(cors());
app.use(express.json());

app.get('/ping', authenticate, authorize(UserRole.USER_GUEST), ping);
app.post('/login', bindBodyOrError(UserParams), login);
app.post('/signup', bindBodyOrError(UserParams), signup);

export default app;