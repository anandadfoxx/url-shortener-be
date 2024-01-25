import 'jest';
import getConnection from '../../../db/connection';
import { userSchema } from '../../../db/schema';
import { DbCollectionName } from '../../../utils/misc/enum';
import dotenv from 'dotenv';
import { encryptPassword } from '../../../utils/encryption/bcrypt';
import crypto from 'crypto';

let verifyPayload: string | undefined = undefined;

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

describe('Login Account', () => {
  beforeAll(async () => {
    dotenv.config();
    const db = await getConnection();
    const User = db.model(DbCollectionName.Users, userSchema);
    await User.deleteMany({});

    verifyPayload = crypto.randomBytes(48).toString('hex');

    await User.create({
      email: 'tester123@gmail.com',
      password: await encryptPassword('tester123!'),
      isVerified: false,
      verifyPayload: verifyPayload
    });
  });
  
  it('No email', async () => {
    const response = await apiFetch('/login', 'POST', {
      'email': 'newtest@gmail.com',
      'password': 'tester123!'
    });

    expect(response['success']).toEqual(false);
    expect(response['description']).toEqual('Email or password invalid, please check your input.');
  });

  it('Invalid password', async () => {
    const response = await apiFetch('/login', 'POST', {
      'email': 'tester123@gmail.com',
      'password': 'Usss!!'
    });

    expect(response['success']).toEqual(false);
    expect(response['description']).toEqual('Email or password invalid, please check your input.');
  });
  it('Not verified account', async () => {
    const response = await apiFetch('/login', 'POST', {
      'email': 'tester123@gmail.com',
      'password': 'tester123!'
    });

    expect(response['success']).toEqual(false);
    expect(response['description']).toEqual("Your account has not been verified, please check your email.");
  });
  it('Verify account', async () => {
    const response = await apiFetch('/verify', 'POST', {
      'payload': verifyPayload
    });

    expect(response['success']).toEqual(true);
    expect(response['description']).toEqual("Your account has been verified successfully, you can proceed to login.");
  });
  it('Verified account', async () => {
    const response = await apiFetch('/login', 'POST', {
      'email': 'tester123@gmail.com',
      'password': 'tester123!'
    });

    expect(response['success']).toEqual(true);
    expect(response['token']).toBeDefined();
  });
})