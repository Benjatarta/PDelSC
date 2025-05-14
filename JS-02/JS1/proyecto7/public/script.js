// funcion para buscar perro
document.getElementById('formBuscarPerro').addEventListener('submit', function (e) {
    e.preventDefault();
    const input = document.getElementById('inputPerro').value.trim();
    const array = input.split(',').map(p => p.trim().toLowerCase());
    const index = array.indexOf('perro');
    document.getElementById('resultadoPerro').textContent =
        index !== -1 ? `La palabra "perro" está en la posición ${index}.` : 'La palabra "perro" no está en el array.';
});

// funcion para buscar el numero 50
document.getElementById('formBuscarNumero').addEventListener('submit', function (e) {
    e.preventDefault();
    const input = document.getElementById('inputNumeros').value.trim();
    const array = input.split(',').map(n => parseInt(n.trim()));
    const index = array.indexOf(50);
    document.getElementById('resultadoNumero').textContent =
        index !== -1 ? `El número 50 está en la posición ${index}.` : 'El número 50 no está en el array.';
});

// funcion para buscar madrid
document.getElementById('formBuscarCiudad').addEventListener('submit', function (e) {
    e.preventDefault();
    const input = document.getElementById('inputCiudad').value.trim();
    const ciudades = input.split(',').map(c => c.trim().toLowerCase());
    const index = ciudades.indexOf('madrid');
    document.getElementById('resultadoCiudad').textContent =
        index !== -1 ? `La ciudad "Madrid" está en la posición ${index}.` : 'La ciudad "Madrid" no está en el array.';
});
