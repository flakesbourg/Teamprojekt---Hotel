import { MongoClient, ObjectId } from 'mongodb';
import express from 'express';
import { emailData } from '../../secrets/emailData.mjs';
import nodemailer from 'nodemailer';

const client = new MongoClient('mongodb://127.0.0.1:27017');
const dataBase = 'hotel';
const server = new express.Router();

server.use(express.json());

server.get('/order/:id', (req, res) => {
  const id = req.params.id;

  if (ObjectId.isValid(id)) {
    try {
      (async function () {
        client.connect();
        const db = client.db(dataBase);

        const reservationCollection = db.collection('reservations');
        const reservations = await reservationCollection.find({ customer: ObjectId(id) }).toArray();

        if (reservations.length === 0) {
          res.sendStatus(404);
          return;
        }

        const roomCollection = db.collection('rooms');
        const rooms = await roomCollection.find().toArray();

        const arrival = new Date(reservations[0].arrival);
        const departure = new Date(reservations[0].departure);

        const totalNights = (departure.getTime() - arrival.getTime()) / (1000 * 3600 * 24);

        let totalPrice = 0;

        for (const room of rooms) {
          for (const reservation of reservations) {
            if (room._id.equals(reservation.room)) {
              totalPrice += room.price;
            }
          }
        }

        totalPrice *= totalNights;

        const data = {
          id: id,
          arrival: arrival,
          departure: departure,
          nights: totalNights,
          price: totalPrice,
          rooms: reservations.length
        };

        res.status(200).send(JSON.stringify(data));
      })();
    } catch (error) {
      res.status(404).send();
    }
  } else {
    res.sendStatus(400);
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
    res.status(400).send('Anreise-/Abreisedatum ungültig');
  } else if (basic < 0 || family < 0 || premium < 0) {
    res.status(400).send('Ausgewählten Zimmer sind ungültig');
  } else {
    try {
      (async function () {
        client.connect();
        const db = client.db(dataBase);
        const customersCollection = db.collection('customers');

        const customer = await customersCollection.insertOne(req.body.user);
        const customerId = customer.insertedId;

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
        const basicAmount = rooms.filter(item => item.roomType === 'basic');
        const familyAmount = rooms.filter(item => item.roomType === 'family');
        const premiumAmount = rooms.filter(item => item.roomType === 'premium');

        if (basic > basicAmount.length || family > familyAmount.length || premium > premiumAmount.length) {
          res.status(400).send('Die ausgewählten Zimmer sind nicht verfügbar');
        } else {
          for (let i = 0; i < basic; i++) {
            reservationCollection.insertOne({ customer: customerId, room: basicAmount[i]._id, arrival: arrival.toISOString().substring(0, 10), departure: departure.toISOString().substring(0, 10) });
          }
          for (let i = 0; i < family; i++) {
            reservationCollection.insertOne({ customer: customerId, room: familyAmount[i]._id, arrival: arrival.toISOString().substring(0, 10), departure: departure.toISOString().substring(0, 10) });
          }
          for (let i = 0; i < premium; i++) {
            reservationCollection.insertOne({ customer: customerId, room: premiumAmount[i]._id, arrival: arrival.toISOString().substring(0, 10), departure: departure.toISOString().substring(0, 10) });
          }

          const mail = `<h2>Vielen Dank für Ihre Reservierung im Grandline Hotel</h2>
          <div style="border: 1px solid black; border-radius:5px; box-shadow: 0px 0px 21px 1px #000000;">
            <div style="display:flex;">
              <div style="margin:0 45px">
                <p>Check-In</p>
                <h4>` + arrival.toLocaleDateString('de-DE') + `</h4>
              </div>
              <div style="margin:0 45px">
                <p>Check-Out</p>
                <h4>` + departure.toLocaleDateString('de-DE') + `</h4>
              </div>
              <div style="margin:0 45px">
                <p>Telefonnummer</p>
                <h4>0123456789</h4> 
              </div>
            </div>
            <div style="display:flex;">
              <div style="margin:0 45px">
                <p>Adresse</p>
                <h4>Vulkanstr. 11, Vulkaneifel, Deutschland</h4>
              </div>
              <div style="margin:0 45px">
                <p>Bestellnummer</p>
                <h4>` + customerId + `</h4>
              </div>
            </div>
          </div>
          <a href="">Buchung Stornieren</a>
          `;

          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: emailData.user,
              pass: emailData.pass
            }
          });

          const mailOptions = {
            from: emailData.user,
            to: email,
            subject: 'Zimmerreservierung - Grandline Hotel',
            html: mail
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email wurde gesendet: ' + info.response);
            }
          });

          res.sendStatus(200);
        }
      })();
    } catch (error) {
      res.status(404).send();
    }
  }
});

server.delete('/order/:id', (req, res) => {
  const id = req.params;

  if (!ObjectId.isValid(id)) {
    res.status(400).send('Bestellnummer ist ungültig');
  } else {
    try {
      (async function () {
        client.connect();
        const db = client.db(dataBase);
        const reservationCollection = db.collection('reservations');
        const customersCollection = db.collection('customers');

        reservationCollection.deleteMany({ customer: ObjectId(id) });

        customersCollection.deleteOne({ _id: ObjectId(id) });

        res.sendStatus(200);
      })();
    } catch (error) {
      res.status(404).send();
    }
  }
});

server.post('/order/dates', function (req, res) {
  const id = req.body.id;
  const newArrival = new Date(req.body.arrival);
  const newDeparture = new Date(req.body.departure);

  if (!ObjectId.isValid(id) || isNaN(newArrival.getTime()) || isNaN(newDeparture.getTime()) || newArrival < Date.now() || newArrival > newDeparture) {
    res.sendStatus(400);
  } else {
    try {
      (async function () {
        client.connect();
        const db = client.db(dataBase);
        const reservationCollection = db.collection('reservations');

        const reservations = await reservationCollection.find({ customer: { $ne: ObjectId(id) } }).toArray();
        const myReservations = await reservationCollection.find({ customer: ObjectId(id) }).toArray();

        let myRooms = [];
        for (let i = 0; i < myReservations.length; i++) {
          myRooms.push(new ObjectId(myReservations[i].room));
        }

        const roomCollection = db.collection('rooms');
        const rooms = await roomCollection.find().toArray();
        myRooms = await roomCollection.find({ _id: { $in: myRooms } }).toArray();
        const notAvailable = [];

        for (const room of rooms) {
          for (const reservation of reservations) {
            if (room._id.equals(reservation.room) && !(newDeparture < new Date(reservation.arrival) || newArrival > new Date(reservation.departure))) {
              notAvailable.push(room);
              break;
            }
          }
        }

        const availableRooms = rooms.filter((elem) => !notAvailable.includes(elem));

        const myBasic = (myRooms.filter((elem) => elem.roomType === 'basic')).length;
        const myFamily = (myRooms.filter((elem) => elem.roomType === 'family')).length;
        const myPremium = (myRooms.filter((elem) => elem.roomType === 'premium')).length;

        const basicAmount = availableRooms.filter(item => item.roomType === 'basic');
        const familyAmount = availableRooms.filter(item => item.roomType === 'family');
        const premiumAmount = availableRooms.filter(item => item.roomType === 'premium');

        if (myBasic > basicAmount.length || myFamily > familyAmount.length || myPremium > premiumAmount.length) {
          res.status(400).send('Die ausgewählten Zimmer sind nicht verfügbar');
        } else {
          reservationCollection.deleteMany({ customer: ObjectId(id) });

          for (let i = 0; i < myBasic; i++) {
            reservationCollection.insertOne({ customer: new ObjectId(id), room: new ObjectId(basicAmount[i]._id), arrival: newArrival.toISOString().substring(0, 10), departure: newDeparture.toISOString().substring(0, 10) });
          }
          for (let i = 0; i < myFamily; i++) {
            reservationCollection.insertOne({ customer: new ObjectId(id), room: new ObjectId(familyAmount[i]._id), arrival: newArrival.toISOString().substring(0, 10), departure: newDeparture.toISOString().substring(0, 10) });
          }
          for (let i = 0; i < myPremium; i++) {
            reservationCollection.insertOne({ customer: new ObjectId(id), room: new ObjectId(premiumAmount[i]._id), arrival: newArrival.toISOString().substring(0, 10), departure: newDeparture.toISOString().substring(0, 10) });
          }
          res.sendStatus(200);
        }
      })();
    } catch (error) {
      res.status(404).send();
    }
  }
});

export { server as orderRouter };
