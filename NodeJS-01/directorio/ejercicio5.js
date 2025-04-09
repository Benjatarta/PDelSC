// server.mjs
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<div style="display: grid; grid-template-columns: repeat(1fr, 2);height: 75vh; width: 75vw; border: solid; border-color: black;"><h1 style="color: red;"> River 3 - Boca 1 </h1><h2>Pepe</h2></div>');
});

// starts a simple http server locally on port 3000
server.listen(8085, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:8085');
});

// run with `node server.mjs`
