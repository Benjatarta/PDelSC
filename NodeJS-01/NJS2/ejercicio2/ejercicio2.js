import http from 'http';
import { crear } from './modulo1.js'
import fs from 'fs';

http.createServer(function (req, res) {
  // aca llamo a la funcion crear
  crear();

  // se lee el archivo
  fs.readFile('archivo.html', 'utf8', (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('error al leer el archivo');
      return;
    }

    // devolvemos el contenido
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  });
}).listen(8085, () => {
  console.log('Listening on 127.0.0.1:8085');
});