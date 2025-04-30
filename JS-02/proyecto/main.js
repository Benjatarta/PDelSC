const express = require('express');
const app = express();
const path = require('path');
const port = 3001;
const personas = []; // array

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para procesar el formulario
app.post('/enviar', (req, res) => {
    const persona = {
        usr: req.body.usr,
        pass: req.body.pass
    };
    personas.push(persona);
    console.log(personas);
    res.send('Persona agregada correctamente. <a href="/">Volver</a>');
});

// Ruta para ver las personas guardadas
app.get('/personas', (req, res) => {
    let lista = '<h1>Listado de personas</h1><ul>';
    personas.forEach(p => {
        lista += `<li>${p.usr} - ${p.pass}</li>`;
    });
    lista += '</ul><a href="/">Volver</a>';
    res.send(lista);
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en: http://localhost:${port}`);
});
