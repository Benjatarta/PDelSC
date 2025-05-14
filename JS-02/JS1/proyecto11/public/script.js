// Filtrar números > 10
document.getElementById('formNumeros').addEventListener('submit', function(e) {
    e.preventDefault();
    const numeros = document.getElementById('inputNumeros').value.split(',').map(n => parseFloat(n.trim()));
    const resultado = numeros.filter(n => n > 10);
    document.getElementById('resultadoNumeros').textContent = `Resultado: ${resultado.join(', ')}`;
  });
  
  // Palabras con más de 5 letras
  document.getElementById('formPalabras').addEventListener('submit', function(e) {
    e.preventDefault();
    const palabras = document.getElementById('inputPalabras').value.split(',').map(p => p.trim());
    const resultado = palabras.filter(p => p.length > 5);
    document.getElementById('resultadoPalabras').textContent = `Resultado: ${resultado.join(', ')}`;
  });
  
  // Usuarios activos
  document.getElementById('formUsuarios').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('inputUsuarios').value.split(',').map(u => u.trim());
    const usuarios = input.map(item => {
      const [nombre, activo] = item.split(':');
      return { nombre, activo: activo === 'true' };
    });
    const activos = usuarios.filter(u => u.activo).map(u => u.nombre);
    document.getElementById('resultadoUsuarios').textContent = `Usuarios activos: ${activos.join(', ')}`;
  });
  