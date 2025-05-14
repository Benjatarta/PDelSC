// funcion para multiplicar por 3
document.getElementById('formMultiplicar').addEventListener('submit', function(e) {
    e.preventDefault();
    const numeros = document.getElementById('inputNumeros').value.split(',').map(n => Number(n.trim()));
    const resultado = numeros.map(n => n * 3);
    document.getElementById('resultadoMultiplicar').textContent = `Resultado: ${resultado.join(', ')}`;
  });
  
  // funcion para convertir en mayus
  document.getElementById('formMayusculas').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombres = document.getElementById('inputNombres').value.split(',').map(n => n.trim());
    const resultado = nombres.map(nombre => nombre.toUpperCase());
    document.getElementById('resultadoMayusculas').textContent = `Resultado: ${resultado.join(', ')}`;
  });
  
  // funcion para sumar el iva
  document.getElementById('formIVA').addEventListener('submit', function(e) {
    e.preventDefault();
    const precios = document.getElementById('inputPrecios').value.split(',').map(p => parseFloat(p.trim()));
    const resultado = precios.map(precio => (precio * 1.21).toFixed(2));
    document.getElementById('resultadoIVA').textContent = `Precios con IVA: ${resultado.join(', ')}`;
  });
  