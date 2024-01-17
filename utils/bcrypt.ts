import bcrypt from 'bcryptjs';

export function encryptPassword(password: string): Promise<string> {
  return bcrypt.genSalt(10)
  .then((salt) => bcrypt.hash(password, salt))
  .then(hash => hash)
  .catch(err => err)
};

export function verifyPassword(password: string, hashPwd: string): Promise<boolean> {
  return bcrypt.compare(password, hashPwd)
  .then(correct => correct);
}