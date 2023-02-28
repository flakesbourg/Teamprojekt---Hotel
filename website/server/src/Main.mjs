import { MongoClient } from 'mongodb';
import express from 'express';

const client = new MongoClient('mongodb://127.0.0.1:27017');
const dataBase = 'hotel';
const server = new express.Router();

server.use(express.json());

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

server.post('/order', (req, res) => {
  const firstName = req.body.user.firstName;
  const lastName = req.body.user.lastName;
  const gender = req.body.user.gender;
  const email = req.body.user.email;
  const phone = req.body.user.phone;
  const city = req.body.user.address.city;
  const street = req.body.user.address.street;
  const houseNumber = req.body.user.address.houseNumber;
  const zipCode = req.body.user.address.zipCode;

  const arrival = new Date(req.body.reservations.arrival);
  const departure = new Date(req.body.reservations.departure);

  const basic = req.body.reservations.basic;
  const family = req.body.reservations.family;
  const premium = req.body.reservations.premium;

  console.log(arrival, departure);

  if (firstName.trim() === '' || firstName === undefined || lastName.trim() === '' || lastName === undefined) {
    res.status(400).send('Vor- bzw. Nachname ungültig');
  } else if (gender !== 'm' && gender !== 'w' && gender !== 'd') {
    res.status(400).send('Geschlecht fehlt/ungültig');
  } else if (email === undefined || !(/\S+@\S+\.\S/).test(email)) {
    res.status(400).send('Email ungültig');
  } else if (Number.isNaN(Number(phone))) {
    res.status(400).send('Telefonnummer ungültig');
  } else if (city.trim() === '' || city === undefined || street.trim() === '' || street === undefined || Number.isNaN(Number(zipCode)) || Number.isNaN(Number(houseNumber))) {
    res.status(400).send('Adresse ungültig');
  } else if (isNaN(arrival.getTime()) || isNaN(departure.getTime()) || arrival < Date.now() || arrival > departure) {
    res.status(400).send('Anreise-/Abreisedatum ungültig')
  } else if (basic < 0 || family < 0 || premium < 0) {

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
      })();
    } catch (error) {
      res.status(404).send();
    }
  }
});

export { server as router };
