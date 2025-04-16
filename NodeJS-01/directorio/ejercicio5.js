// server.mjs
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<table style="border: 1px solid;"><tr><th style="border: 1px solid;">Operacion</th><th style="border: 1px solid;">Resultado</th></tr><tr><td style="border: 1px solid;">5+3</td><td style="border: 1px solid;">8</td></tr><tr><td style="border: 1px solid;">8-6</td><td style="border: 1px solid;">2</td></tr><tr><td style="border: 1px solid;">3*11</td><td style="border: 1px solid;">33</td></tr><tr><td style="border: 1px solid;">30/5</td><td style="border: 1px solid;">6</td></tr></table>');
});

// starts a simple http server locally on port 3000
server.listen(8085, '127.0.0.1', () => {
  console.log('Listening on 127.0.1:8085');
});

// run with `node server.mjs`
