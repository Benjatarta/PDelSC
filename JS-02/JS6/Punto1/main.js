const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.post('/guardar', (req, res) => {
  const numeros = req.body.numeros;
  const contenido = numeros.join(', ');
  const ruta = path.join(__dirname, 'numeros.txt');

  fs.writeFile(ruta, contenido, err => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error al guardar el archivo.");
    }
    res.send("Archivo guardado correctamente como numeros.txt");
  });
});

app.listen(3001, () => {
  console.log(`Servidor en http://localhost:3001`);
});