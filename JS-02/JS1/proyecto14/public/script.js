// Invertir letras
document.getElementById('formLetras').addEventListener('submit', function(e) {
    e.preventDefault();
    const letras = document.getElementById('inputLetras').value
      .split(',')
      .map(l => l.trim());
    const invertido = [...letras].reverse();
    document.getElementById('resultadoLetras').textContent = `Invertido: ${invertido.join(', ')}`;
  });
  
  // Invertir números
  document.getElementById('formNumeros').addEventListener('submit', function(e) {
    e.preventDefault();
    const numeros = document.getElementById('inputNumeros').value
      .split(',')
      .map(n => parseFloat(n.trim()));
    const invertido = [...numeros].reverse();
    document.getElementById('resultadoNumeros').textContent = `Invertido: ${invertido.join(', ')}`;
  });
  
  // Invertir texto
  document.getElementById('formTexto').addEventListener('submit', function(e) {
    e.preventDefault();
    const texto = document.getElementById('inputTexto').value.trim();
    const invertido = texto.split('').reverse().join('');
    document.getElementById('resultadoTexto').textContent = `Invertido: ${invertido}`;
  });
  