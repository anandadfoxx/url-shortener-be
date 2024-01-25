import 'jest';
import getConnection from '../../../db/connection';
import { userSchema } from '../../../db/schema';
import { DbCollectionName } from '../../../utils/misc/enum';
import { encryptPassword } from '../../../utils/encryption/bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';

const apiFetch = async (endpoint: string, method: string, body?: unknown) => {
  let baseUrl = 'http://localhost:8080';
  return await (await fetch(`${baseUrl}${endpoint}`, {
    method: method,
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify(body)
  }))
    .json();
};

describe('Register Account', () => {
  beforeAll(async () => {
    dotenv.config();
    const db = await getConnection();
    const User = db.model(DbCollectionName.Users, userSchema);

    await User.deleteMany({});

    await User.create({
      email: 'tester123@gmail.com',
      password: await encryptPassword('tester123!'),
      isVerified: false,
      verifyPayload: crypto.randomBytes(48).toString('hex'),
    });
  });
  
  it('Register different email address', async () => {
    const response = await apiFetch('/signup', 'POST', {
      'email': 'newtest@gmail.com',
      'password': 'tester123!'
    });

    expect(response['success']).toEqual(true);
    expect(response['description']).toEqual('User has successfully registered. Please check your email for verification.');
  });

  it('Register conflict email address', async () => {
    const response = await apiFetch('/signup', 'POST', {
      'email': 'newtest@gmail.com',
      'password': 'tester123!'
    });

    expect(response['success']).toEqual(false);
    expect(response['description']).toEqual('Email exists, please use another email.');
  });
})