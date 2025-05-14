// funcion para ordenar los numeros
document.getElementById('formNumeros').addEventListener('submit', function(e) {
    e.preventDefault();
    const numeros = document.getElementById('inputNumeros').value
      .split(',')
      .map(n => parseFloat(n.trim()));
    const ordenados = [...numeros].sort((a, b) => a - b);
    document.getElementById('resultadoNumeros').textContent = `Ordenados: ${ordenados.join(', ')}`;
  });
  
  // funcion para ordenar las palabtas
  document.getElementById('formPalabras').addEventListener('submit', function(e) {
    e.preventDefault();
    const palabras = document.getElementById('inputPalabras').value
      .split(',')
      .map(p => p.trim());
    const ordenadas = [...palabras].sort((a, b) => a.localeCompare(b));
    document.getElementById('resultadoPalabras').textContent = `Ordenadas: ${ordenadas.join(', ')}`;
  });
  
  // funcion para ordenar por edad
  document.getElementById('formObjetos').addEventListener('submit', function(e) {
    e.preventDefault();
    const entrada = document.getElementById('inputObjetos').value.split(',');
    const personas = entrada.map(par => {
      const [nombre, edad] = par.split('-').map(str => str.trim());
      return { nombre, edad: parseInt(edad) };
    });
  
    personas.sort((a, b) => a.edad - b.edad);
    const resultado = personas.map(p => `${p.nombre} (${p.edad})`).join(', ');
    document.getElementById('resultadoObjetos').textContent = `Ordenados: ${resultado}`;
  });
  