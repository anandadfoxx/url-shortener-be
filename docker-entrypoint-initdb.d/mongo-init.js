db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);
db.createUser({
  user: process.env.MONGO_INITDB_USER,
  pwd: process.env.MONGO_INITDB_PWD,
  roles: [{ role: 'readWrite', db: process.env.MONGO_INITDB_DATABASE }],
});
db.createCollection('users');
console.log(process.env)