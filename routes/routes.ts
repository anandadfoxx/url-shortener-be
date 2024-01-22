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
import { UserRole } from '../utils/misc/enum';
import ShortenerQueryParams from '../parameters/short_query';
import getShortLink from '../controllers/shortener/get_short';
import ShortenerEntryOptions from '../parameters/short_entry';
import createShortLink from '../controllers/shortener/create_short';

const app: Express = express();

app.use(log);
app.use(cors());
app.use(express.json());

// User Profile Section
app.get('/ping', ping);
app.post('/login', bindBodyOrError(UserParams), login);
app.post('/signup', bindBodyOrError(UserParams), signup);


app.get('/:uriShort', bindBodyOrError(ShortenerQueryParams), getShortLink);
app.post('/short', authenticate, authorize(UserRole.USER_MEMBER), bindBodyOrError(ShortenerEntryOptions), createShortLink);

export default app;