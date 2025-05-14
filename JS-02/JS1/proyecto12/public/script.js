// funcion para sumar
document.getElementById('formSuma').addEventListener('submit', function(e) {
    e.preventDefault();
    const valores = document.getElementById('inputSuma').value.split(',').map(n => parseFloat(n.trim()));
    const suma = valores.reduce((acc, val) => acc + val, 0);
    document.getElementById('resultadoSuma').textContent = `Suma total: ${suma}`;
  });
  
  // funcion para multiplicar
  document.getElementById('formMultiplicacion').addEventListener('submit', function(e) {
    e.preventDefault();
    const valores = document.getElementById('inputMultiplicacion').value.split(',').map(n => parseFloat(n.trim()));
    const multiplicacion = valores.reduce((acc, val) => acc * val, 1);
    document.getElementById('resultadoMultiplicacion').textContent = `Multiplicación total: ${multiplicacion}`;
  });
  
  // funcion para el total
  document.getElementById('formPrecios').addEventListener('submit', function(e) {
    e.preventDefault();
    const precios = document.getElementById('inputPrecios').value.split(',').map(p => parseFloat(p.trim()));
    const total = precios.reduce((acc, precio) => acc + precio, 0);
    document.getElementById('resultadoPrecios').textContent = `Total de precios: $${total}`;
  });
  