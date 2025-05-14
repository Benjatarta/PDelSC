// Buscar "perro" en un array
document.getElementById('formBuscarPerro').addEventListener('submit', function (e) {
    e.preventDefault();
    const array = ['gato', 'perro', 'conejo'];
    const index = array.indexOf('perro');
    document.getElementById('resultadoPerro').textContent = index !== -1 ? `La palabra "perro" está en la posición ${index}.` : 'La palabra "perro" no está en el array.';
});

// Buscar el número 50 en un array
document.getElementById('formBuscarNumero').addEventListener('submit', function (e) {
    e.preventDefault();
    const array = [10, 20, 30, 50, 70];
    const index = array.indexOf(50);
    document.getElementById('resultadoNumero').textContent = index !== -1 ? `El número 50 está en la posición ${index}.` : 'El número 50 no está en el array.';
});

// Buscar la ciudad "Madrid" en un array
document.getElementById('formBuscarCiudad').addEventListener('submit', function (e) {
    e.preventDefault();
    const ciudades = ['Barcelona', 'Madrid', 'Sevilla'];
    const index = ciudades.indexOf('Madrid');
    document.getElementById('resultadoCiudad').textContent = index !== -1 ? `La ciudad "Madrid" está en la posición ${index}.` : 'La ciudad "Madrid" no está en el array.';
});
