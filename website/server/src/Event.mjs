import { MongoClient } from 'mongodb';
import express from 'express';

const client = new MongoClient('mongodb://127.0.0.1:27017');
const dataBase = 'hotel';
const server = new express.Router();

server.use(express.json());

server.get('/event', (req, res) => {
  const people = req.query.people;
  const date = new Date(req.query.date);

  try {
    (async function () {
      client.connect();
      const db = client.db(dataBase);
      const premisesCollection = db.collection('premises');
      const requestCollection = db.collection('premiseRequest');

      const premises = await premisesCollection.find().toArray();
      const requests = await requestCollection.find().toArray();

      let suitablePremises = premises.filter(item => people < item.maxPeople);
      const notAvailable = [];

      for (const premise of suitablePremises) {
        for (const request of requests) {
          if (premise._id.equals(request.premise) && date.toDateString() === (new Date(request.date)).toDateString()) {
            notAvailable.push(premise);
            break;
          }
        }
      }

      suitablePremises = suitablePremises.filter(item => !notAvailable.includes(item));
      if (suitablePremises.length > 0) {
        res.status(200).send(suitablePremises);
      } else {
        res.sendStatus(400);
      }
    })();
  } catch (error) {
    console.log(error);
  }
});

server.post('/event', (req, res) => {
  const people = req.body.numberOfPeople;
  const date = new Date(req.body.eventDate);
  const firstName = req.body.requestFirstName;
  const lastName = req.body.requestLastName;
  const company = req.body.requestCompany;
  const reason = req.body.requestReason;
  const email = req.body.requestEmail;
  const phone = req.body.requestPhone;
  const premise = req.body.premise;

  if (isNaN(date.getTime()) || date < Date.now()) {
    res.status(400).send('Datum ungültig');
  } else if (firstName.trim() === '' || firstName === undefined || lastName.trim() === '' || lastName === undefined || reason.trim() === '' || reason === undefined) {
    res.status(400).send('Name oder Veranstaltungsgrund ungültig');
  } else if (people < 10 || people > 150) {
    res.status(400).send('Personenanzahl ungültig');
  } else if (email === undefined || !(/\S+@\S+\.\S/).test(email)) {
    res.status(400).send('Email ungültig');
  } else if (premise !== 'small' && premise !== 'medium' && premise !== 'large') {
    res.status(400).send('Räumlichkeit ungültig');
  } else if (Number.isNaN(Number(phone))) {
    res.status(400).send('Telefonnummer ungültig');
  } else {
    try {
      (async function () {
        client.connect();
        const db = client.db(dataBase);
        const premisesCollection = db.collection('premises');
        const requestCollection = db.collection('premiseRequest');
        const customersCollection = db.collection('customers');

        const premises = await premisesCollection.find().toArray();
        const requests = await requestCollection.find().toArray();

        let suitablePremises = premises.filter(item => people < item.maxPeople);
        const notAvailable = [];

        for (const premise of suitablePremises) {
          for (const request of requests) {
            if (premise._id.equals(request.premise) && date.toDateString() === (new Date(request.date)).toDateString()) {
              notAvailable.push(premise);
              break;
            }
          }
        }

        suitablePremises = suitablePremises.filter(item => !notAvailable.includes(item));
        suitablePremises = suitablePremises.filter(item => item.size === premise);

        if (suitablePremises.length === 1) {
          const customer = await customersCollection.insertOne({ firstName: firstName, lastName: lastName, email: email, phone: phone, company: company });
          const customerId = customer.insertedId;

          requestCollection.insertOne({ customer: customerId, premise: suitablePremises[0]._id, people: people, date: date.toISOString().substring(0, 10), reason: reason });

          res.status(200).redirect('/meetingRequest.html');
        } else {
          res.status(400).redirect('/meetingRequest.html');
        }
      })();
    } catch (error) {
      console.log(error);
    }
  }
});

export { server as eventServer };
