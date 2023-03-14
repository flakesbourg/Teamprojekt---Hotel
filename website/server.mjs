import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { roomsRouter } from './server/src/Rooms.mjs';
import { orderRouter } from './server/src/Order.mjs';
import { weahterRouter } from './server/src/Weather.mjs';
import { careerRouter } from './server/src/Career.mjs';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

let port = 8080;

// Kommandozeilenargumente prüfen
if (process.argv.length !== 3 || !isNaN(Number(process.argv[2]))) {
  port = Number(process.argv[2]);
}

// Server wird erzeugt
const server = express();

server.set('view engine', 'ejs');
server.set('views', path.join(path.dirname(process.argv[1]), 'views'));

server.use(express.static(path.join(
  path.dirname(process.argv[1]), 'client/dist')));

server.use(express.static(path.join(
  path.dirname(process.argv[1]), 'client/dist/templates')));

server.use('/', roomsRouter);
server.use(orderRouter);
server.use(weahterRouter);
server.use(careerRouter);

server.listen(port);
