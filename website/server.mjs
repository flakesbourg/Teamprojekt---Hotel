import express from 'express';
import path from 'path';
import { router } from './server/src/Main.mjs';

let port = 8080;

// Kommandozeilenargumente prüfen
if (process.argv.length !== 3 || !isNaN(Number(process.argv[2]))) {
  port = Number(process.argv[2]);
}

// Server wird erzeugt
const server = express();

server.use(express.static(path.join(
  path.dirname(process.argv[1]), 'client/dist')));

server.use(express.static(path.join(
  path.dirname(process.argv[1]), 'client/dist/templates')));

server.use('/', router);

server.listen(port);
