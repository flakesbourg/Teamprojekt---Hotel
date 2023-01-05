import { MongoClient } from 'mongodb';
import express from 'express';

const client = new MongoClient('mongodb://127.0.0.1:27017');
const dataBase = 'hotel';
const server = new express.Router();

server.get('/getAvailableRooms', (req, res) => {
  const arrival = new Date(req.query.arrival);
  const departure = new Date(req.query.departure);

  if (isNaN(arrival.getTime()) || isNaN(departure.getTime()) || arrival < Date.now() || arrival > departure) {
    res.status(400).send('Einer der Werte ist fehlerhaft');
  } else {
    try {
      (async function () {
        client.connect();
        const db = client.db(dataBase);
        const reservationCollection = db.collection('reservations');
        const roomCollection = db.collection('rooms');
        let rooms = await roomCollection.find().toArray();
        const reservations = await reservationCollection.find().toArray();
        const notAvailable = [];

        for (const room of rooms) {
          for (const reservation of reservations) {
            if (room._id.equals(reservation.room) && !(departure < new Date(reservation.arrival) || arrival > new Date(reservation.departure))) {
              notAvailable.push(room);
              break;
            }
          }
        }
        rooms = rooms.filter(item => !notAvailable.includes(item));
        if (rooms.length === 0) {
          res.status(204).send(rooms);
        } else {
          res.status(200).send(rooms);
        }
      })();
    } catch (error) {
      res.status(404).send();
    }
  }
});

export { server as router };
