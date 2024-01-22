import 'jest';
import getConnection from '../../../db/connection';
import { userSchema } from '../../../db/schema';
import { DbCollectionName } from '../../../utils/misc/enum';
import dotenv from 'dotenv';
import { encryptPassword } from '../../../utils/encryption/bcrypt';

let baseUrl = 'http://localhost:8080';

const apiFetch = async (endpoint: string, method: string, body?: unknown) => {
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

    await User.create({
      email: 'tester123@gmail.com',
      password: await encryptPassword('tester123!')
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
  it('Correct email and password', async () => {
    const response = await apiFetch('/login', 'POST', {
      'email': 'tester123@gmail.com',
      'password': 'tester123!'
    });

    expect(response['success']).toEqual(true);
    expect(response['token']).toBeDefined();
  });
})