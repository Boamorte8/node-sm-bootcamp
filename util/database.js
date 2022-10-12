const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const { MONGODB_URL } = process.env;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(MONGODB_URL)
    .then((client) => {
      console.log('MongoDB connected successfully');
      _db = client.db('course');
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDB = () => {
  if (_db) return _db;
  throw new Error('No database connection available!');
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
