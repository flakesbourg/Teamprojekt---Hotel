import { MongoClient } from 'mongodb';
import express from 'express';

const client = new MongoClient('mongodb://127.0.0.1:27017');
const dataBase = 'bookings';
const server = new express.Router();

server.get('/', (req, res) => {
  try {
    client.connect();
    const db = client.db(dataBase);
    const collection = db.collection('bookingTable');
    collection.insertOne();
  } catch (error) {
    res.status(404).send();
  }
});

export { server as router };
