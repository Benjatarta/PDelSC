// Comprobar si el array contiene la palabra "admin"
document.getElementById('formBuscarAdmin').addEventListener('submit', function (e) {
    e.preventDefault();
    const array = ['usuario', 'admin', 'invitado'];
    const contieneAdmin = array.includes('admin');
    document.getElementById('resultadoAdmin').textContent = contieneAdmin ? 'El array contiene la palabra "admin".' : 'El array no contiene la palabra "admin".';
});

// Comprobar si el array contiene "verde"
document.getElementById('formBuscarVerde').addEventListener('submit', function (e) {
    e.preventDefault();
    const colores = ['rojo', 'azul', 'verde', 'amarillo'];
    const contieneVerde = colores.includes('verde');
    document.getElementById('resultadoVerde').textContent = contieneVerde ? 'El array contiene el color "verde".' : 'El array no contiene el color "verde".';
});

// Verificar si un número está presente antes de sumarlo al array
document.getElementById('formVerificarNumero').addEventListener('submit', function (e) {
    e.preventDefault();
    const numero = parseInt(document.getElementById('numeroInput').value);
    const numeros = [10, 20, 30, 40, 50];

    if (numeros.includes(numero)) {
        document.getElementById('resultadoNumero').textContent = `El número ${numero} ya está en el array. No se añade.`;
    } else {
        numeros.push(numero);
        document.getElementById('resultadoNumero').textContent = `El número ${numero} ha sido añadido al array.`;
    }
});
