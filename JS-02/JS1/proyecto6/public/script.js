// Operación 1: Copiar los primeros 3 elementos de un array de números
document.getElementById('formularioNumeros').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('inputNumeros').value;
    const numeros = input.split(',').map(num => parseInt(num.trim())); // Convertir a número
    const primerosTres = numeros.slice(0, 3); // Copiar los primeros 3 elementos
    document.getElementById('resultadoNumeros').textContent = primerosTres.join(', ');
    limpiarInput('inputNumeros');
});

// Operación 2: Copiar parte del array de películas
document.getElementById('formularioPeliculas').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('inputPeliculas').value;
    const peliculas = input.split(',').map(pelicula => pelicula.trim());
    const copiaPeliculas = peliculas.slice(2, 4); // Copiar desde la posición 2 hasta la 4
    document.getElementById('resultadoPeliculas').textContent = copiaPeliculas.join(', ');
    limpiarInput('inputPeliculas');
});

// Operación 3: Copiar los últimos 3 elementos de un array
document.getElementById('formularioUltimos').addEventListener('submit', function(e) {
    e.preventDefault();
    const input = document.getElementById('inputUltimos').value;
    const numeros = input.split(',').map(num => parseInt(num.trim())); // Convertir a número
    const ultimosTres = numeros.slice(-3); // Copiar los últimos 3 elementos
    document.getElementById('resultadoUltimos').textContent = ultimosTres.join(', ');
    limpiarInput('inputUltimos');
});

// Función para limpiar el input después de cada acción
function limpiarInput(id) {
    document.getElementById(id).value = '';
}
