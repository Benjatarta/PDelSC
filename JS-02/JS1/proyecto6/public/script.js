// funcion para copiar los primeros 3
document.getElementById('formularioNumeros').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('inputNumeros').value;
    const numeros = input.split(',').map(num => parseInt(num.trim()));
    const primerosTres = numeros.slice(0, 3);
    document.getElementById('resultadoNumeros').textContent = primerosTres.join(', ');
    limpiarInput('inputNumeros');
});

// funcion para las peliculas
document.getElementById('formularioPeliculas').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('inputPeliculas').value;
    const peliculas = input.split(',').map(pelicula => pelicula.trim());
    const copiaPeliculas = peliculas.slice(2, 4); 
    document.getElementById('resultadoPeliculas').textContent = copiaPeliculas.join(', ');
    limpiarInput('inputPeliculas');
});

// funcion para copiar los ultimos 3
document.getElementById('formularioUltimos').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('inputUltimos').value;
    const numeros = input.split(',').map(num => parseInt(num.trim())); 
    const ultimosTres = numeros.slice(-3); 
    document.getElementById('resultadoUltimos').textContent = ultimosTres.join(', ');
    limpiarInput('inputUltimos');
});
