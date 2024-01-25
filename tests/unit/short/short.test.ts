import 'jest';
import getConnection from '../../../db/connection';
import { DbCollectionName } from '../../../utils/misc/enum';
import { urlShortSchema, userSchema } from '../../../db/schema';
import { encryptPassword } from '../../../utils/encryption/bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const apiFetch = async (endpoint: string, method: string, body?: unknown, token?: string) => {
  let baseUrl = 'http://localhost:8080';
  return await (await fetch(`${baseUrl}${endpoint}`, {
    method: method,
    headers: {
      'Content-Type': "application/json",
      'Authorization': (token != undefined) ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(body)
  }))
    .json();
};


describe('Link Shortener', () => {
  let jwtToken: string | undefined;
  beforeAll(async () => {
    const db = await getConnection();
    const Shortener = db.model(DbCollectionName.Shorts, urlShortSchema);
    const User = db.model(DbCollectionName.Users, userSchema);

    await Shortener.deleteMany({});
    await User.deleteMany({});

    // Login as user
    await User.create({
      email: 'tester123@gmail.com',
      password: await encryptPassword('tester123!'),
      isVerified: true,
    });

    jwtToken = (await apiFetch('/login', 'POST', {
      'email': 'tester123@gmail.com',
      'password': 'tester123!'
    }))['token'];

    await apiFetch('/short', 'POST', {
      'short_uri': 'siam-ub',
      'long_uri': 'https://siam.ub.ac.id'
    }, jwtToken);
  });

  // When Login
  describe('Login', () => {
    it('Create Link (Login)', async () => {
      const result = await apiFetch('/short', 'POST', {
        'short_uri': 'brone-ub',
        'long_uri': 'https://brone.ub.ac.id',
      }, jwtToken);

      expect(result['success']).toBe(true);
    });
    it('Create Existed Link (Login)', async () => {
      const result = await apiFetch('/short', 'POST', {
        'short_uri': 'siam-ub',
        'long_uri': 'https://siam.ub.ac.id',
      }, jwtToken);

      expect(result['success']).toBe(false);
      expect(result['description']).toBe("Requested short link 'siam-ub' already exist, please request another short link.");
    });
    it('Get Link', async () => {
      const result = await apiFetch(`/brone-ub`, 'GET');

      expect(result['success']).toBe(true);
      expect(result['long_uri']).toBe('https://brone.ub.ac.id');
    });
    it('Edit Link', async () => {
      const result = await apiFetch('/short', 'PUT', {
        'short_uri': 'siam-ub',
        'long_uri': 'https://eling.ub.ac.id'
      }, jwtToken);

      expect(result['success']).toBe(true);
    });
    it('Delete Link (Correct Login)', async () => {
      const result = await apiFetch('/brone-ub', 'DELETE', undefined, jwtToken);

      expect(result['success']).toBe(true);
      expect(result['description']).toBe("Short link 'brone-ub' has been deleted successfully.");
    });
  });

  // When Not Login
  describe('Not Login', () => {
    it('Create Link (Not Login)', async () => {
      const result = await apiFetch('/short', 'POST', {
        'short_uri': 'brone-ub',
        'long_uri': 'https://brone.ub.ac.id',
      });

      expect(result['success']).toBe(false);
    });
    it('Create Existed Link (Not Login)', async () => {
      const result = await apiFetch('/short', 'POST', {
        'short_uri': 'siam-ub',
        'long_uri': 'https://siam.ub.ac.id',
      });

      expect(result['success']).toBe(false);
    });
    it('Get Deleted Link', async () => {
      const result = await apiFetch(`/brone-ub`, 'GET');

      expect(result['success']).toBe(false);
      expect(result['description']).toBe('Link not found.');
    });
    it('Get Link (SIAM UB become ELING UB)', async () => {
      const result = await apiFetch(`/siam-ub`, 'GET');

      expect(result['success']).toBe(true);
      expect(result['long_uri']).toBe('https://eling.ub.ac.id');
    });
    it('Delete Link (Not Login)', async () => {
      const result = await apiFetch('/brone-ub', 'DELETE', undefined);

      expect(result['success']).toBe(false);
    });
  });

  // // Non authorized author want to alter other short link
  describe('Not authorized Alter', () => {
    let jwtTokenSecondAcc: string | undefined;
    beforeAll(async () => {
      const db = await getConnection();
      const Shortener = db.model(DbCollectionName.Shorts, urlShortSchema);
      const User = db.model(DbCollectionName.Users, userSchema);

      // Login as user
      await User.create({
        email: 'maliciousacc@gmail.com',
        password: await encryptPassword('mallicious!!'),
        isVerified: true,
      });

      jwtTokenSecondAcc = (await apiFetch('/login', 'POST', {
        'email': 'maliciousacc@gmail.com',
        'password': 'mallicious!!'
      }))['token'];
    });

    it('Create Link', async () => {
      const result = await apiFetch('/short', 'POST', {
        'short_uri': 'siam-ub',
        'long_uri': 'https://siam.ub.ac.id'
      }, jwtTokenSecondAcc);
      
      expect(result['success']).toBe(false);
    });
    it('Edit Link', async () => {
      const result = await apiFetch('/short', 'PUT', {
        'short_uri': 'siam-ub',
        'long_uri': 'https://eling.ub.ac.id'
      }, jwtTokenSecondAcc);
      
      expect(result['success']).toBe(false);
    });
    it('Delete Link', async () => {
      const result = await apiFetch('/siam-ub', 'DELETE', undefined, jwtTokenSecondAcc);
      expect(result['success']).toBe(false);
    });
  })
});