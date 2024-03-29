import express, { Express } from 'express';

// Enums
import { UserRole } from '../utils/misc/enum';

// Middlewares
import cors from 'cors';
import log from '../middleware/log/logger';
import bindBodyOrError from '../middleware/bind';
import ping from '../controllers/ping';
import authorize from '../middleware/user/authorization';
import authenticate from '../middleware/user/authentication';

// Parameters
import ShortenerQueryParams from '../parameters/short_query';
import ShortenerEntryParams from '../parameters/short_entry';
import UserParams from '../parameters/user';
import VerifyParams from '../parameters/verify';

// Routes
import login from '../controllers/user/login';
import signup from '../controllers/user/signup';
import getShortLink from '../controllers/shortener/get_short';
import createShortLink from '../controllers/shortener/create_short';
import verifyAccount from '../controllers/user/verify';
import deleteShortLink from '../controllers/shortener/delete_short';
import editShortLink from '../controllers/shortener/edit_short';

const app: Express = express();

app.use(log);
app.use(cors());
app.use(express.json());

// User Profile Section
app.get('/ping', ping);
app.post('/signup', bindBodyOrError(UserParams), signup);
app.post('/login', bindBodyOrError(UserParams), login);
app.get(`/verify`, bindBodyOrError(VerifyParams), verifyAccount);


app.get(`/:${ShortenerQueryParams[0].param}`, bindBodyOrError(ShortenerQueryParams), getShortLink);
app.post('/short', authenticate, authorize(UserRole.USER_MEMBER), bindBodyOrError(ShortenerEntryParams), createShortLink);
app.put('/short', authenticate, authorize(UserRole.USER_MEMBER), bindBodyOrError(ShortenerEntryParams), editShortLink)
app.delete(`/:${ShortenerQueryParams[0].param}`, authenticate, authorize(UserRole.USER_MEMBER), bindBodyOrError(ShortenerQueryParams), deleteShortLink);
export default app;