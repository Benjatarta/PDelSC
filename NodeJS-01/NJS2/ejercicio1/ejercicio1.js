//importamos todos los modulos
import { createServer } from 'node:http';
import { myDateTime } from './modulo1.js';
import {suma, resta, multi, division} from './modulo2.js';
import { temperatura } from './modulo3.js';
  
//creamos las variables dandoles un valor
  var sumar = suma (5, 4);
  var restar = resta (14, 2);
  var multis = multi (3, 6);
  var divisiones = division (62, 2);

//creamos el server y mostramos todo en el localhost
  const server = createServer((req, res) =>{
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("El dia y la hora actual es: " + myDateTime());
    res.write('<table style="border: 1px solid;"><tr><th style="border: 1px solid;">Operacion</th><th style="border: 1px solid;">Resultado</th></tr><tr><td style="border: 1px solid;">5+3</td><td style="border: 1px solid;">8</td></tr><tr><td style="border: 1px solid;">8-6</td><td style="border: 1px solid;">2</td></tr><tr><td style="border: 1px solid;">3*11</td><td style="border: 1px solid;">33</td></tr><tr><td style="border: 1px solid;">30/5</td><td style="border: 1px solid;">6</td></tr></table>');
    res.write("La temperatura del dia 16/04/2025 a las 20:00 es de: " + temperatura());
    res.end();
}).listen(8085, '127.0.0.1', () => {
    console.log('Listening on 127.0.0.1:8085');
  });
