// src/db/connect.js
import { MongoClient } from 'mongodb';

let client;
let db;

const connectToDb = async () => {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined. Check your .env file.');
  }

  if (!dbName) {
    throw new Error('MONGODB_DB_NAME is not defined. Check your .env file.');
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);

  return db;
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDb first.');
  }

  return db;
};

export { connectToDb, getDb };