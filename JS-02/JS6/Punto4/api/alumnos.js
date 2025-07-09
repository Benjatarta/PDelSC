const express = require('express');
const router = express.Router();

//creo el array
const alumnos = [
  { id: 1, nombre: 'Benjamín Tartaglia', mail: 'benjatarta03@gmail.com' },
  { id: 2, nombre: 'Jerónimo Jugón', mail: 'jerojugon@gmail.com' },
  { id: 3, nombre: 'Juan Tartaglia', mail: 'juantartaglia14@gmail.com' }
];

//genera un router en / que devuele el objeto alumnos
router.get('/', (req, res) => {
  res.json(alumnos);
});

module.exports = router; 
