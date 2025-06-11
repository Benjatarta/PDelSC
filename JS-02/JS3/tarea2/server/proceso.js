//creo las constantes
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const path = require('path');

// configuracion para guardar los txt en la carpeta
const upload = multer({ dest: 'guardados/' });

router.post('/subir', upload.single('archivo'), (req, res) => {
  const rutaArchivo = req.file.path;

  fs.readFile(rutaArchivo, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer el archivo' });

    
    const numeros = data
      .split(/[\s,]+/)
      .map(n => n.trim())
      .filter(n => n.length);

    //creo arrays
    const validos = [];
    const invalidos = [];

    numeros.forEach(num => {
      if (/^\d+$/.test(num) && num[0] === num[num.length - 1]) {
        validos.push(num);
      } else {
        invalidos.push(num);
      }
    });

    validos.sort((a, b) => parseInt(a) - parseInt(b));

    //creo constantes para el total de validos y el porcentaje
    const total = validos.length + invalidos.length;
    const porcentaje = total ? ((validos.length / total) * 100).toFixed(2) : 0;

    const resultado = `Números válidos:\n${validos.join('\n')}\n\n` + `Cantidad válidos: ${validos.length}\n` + `Cantidad inválidos: ${invalidos.length}\n` + `Porcentaje válidos: ${porcentaje}%`;

    //  guardo los resultados
    fs.writeFileSync(path.join(carpetaResultado, 'resultado.txt'), resultado);

    //muestro por pantalla lo solicitado
    res.json({
      validos,
      totalValidos: validos.length,
      totalInvalidos: invalidos.length,
      porcentaje
    });
  });
});

module.exports = router;
