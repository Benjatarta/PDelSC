const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(express.static('public'));
app.use(express.json());

const alumnosRouter = require('./api/alumnos');
app.use('/api/alumnos', alumnosRouter);

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

app.listen(PORT, () => {
console.log(`Servidor en http://localhost:${PORT}`);
console.log(`Servidor en http://localhost:${PORT}/api/alumnos`);
});