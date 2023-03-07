import express from 'express';
import XMLHttpRequest from 'xhr2';

const server = new express.Router();

server.use(express.json());

server.get('/weather', (req, res) => {
  const request = new XMLHttpRequest();
  request.onload = () => {
    if (request.status === 200) {
      res.send(request.response);
    } else {
      res.sendStatus(request.status);
    }
  };

  request.open('GET', 'https://api.openweathermap.org/data/2.5/forecast?lat=50.15&lon=6.44&cnt=25&units=metric&lang=de&appid=9841b1c07c3fe1251ec36bf36876650c', true);
  request.setRequestHeader('Content-type', 'application/json');
  request.send();
});

export { server as weahterRouter };
