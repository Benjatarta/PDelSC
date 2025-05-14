// funcion para buscar la palabtra admin
document.getElementById('formBuscarAdmin').addEventListener('submit', function (e) {
    e.preventDefault();
    const input = document.getElementById('inputAdmin').value.trim();
    const array = input.split(',').map(item => item.trim().toLowerCase());
    const contieneAdmin = array.includes('admin');
    document.getElementById('resultadoAdmin').textContent =
        contieneAdmin ? 'El array contiene la palabra "admin".' : 'El array no contiene la palabra "admin".';
});

// funcion para buscar el color verde
document.getElementById('formBuscarVerde').addEventListener('submit', function (e) {
    e.preventDefault();
    const input = document.getElementById('inputVerde').value.trim();
    const colores = input.split(',').map(c => c.trim().toLowerCase());
    const contieneVerde = colores.includes('verde');
    document.getElementById('resultadoVerde').textContent =
        contieneVerde ? 'El array contiene el color "verde".' : 'El array no contiene el color "verde".';
});

// funcion para verificar el array
document.getElementById('formVerificarNumero').addEventListener('submit', function (e) {
    e.preventDefault();
    const arrayStr = document.getElementById('numerosInput').value.trim();
    const numero = parseInt(document.getElementById('nuevoNumero').value);
    let numeros = arrayStr.split(',').map(n => parseInt(n.trim()));

    if (numeros.includes(numero)) {
        document.getElementById('resultadoNumero').textContent = `El número ${numero} ya está en el array. No se añade.`;
    } else {
        numeros.push(numero);
        document.getElementById('resultadoNumero').textContent = `El número ${numero} ha sido añadido al array: [${numeros.join(', ')}]`;
    }
});
