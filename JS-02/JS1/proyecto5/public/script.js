let letras = [];

// funcion para cargar la letra
document.getElementById('formularioPalabra').addEventListener('submit', function(e) {
    e.preventDefault();
    const letra = document.getElementById('inputLetra').value.trim();
    if (letra) {
        letras.push(letra);
        actualizarLista('listaLetras1');
        limpiarInputs(['inputLetra']);
    }
});

// funcion para eliminar
document.getElementById('btnEliminar').addEventListener('click', function() {
    if (letras.length > 1) {
        letras.splice(1, 2);
    }
    actualizarLista('listaLetras1');
});

// funcion para insertar desde la posicion dos
document.getElementById('formularioInsertar').addEventListener('submit', function(e) {
    e.preventDefault();
    const nuevaLetra = document.getElementById('inputInsertar').value.trim();
    if (nuevaLetra) {
        letras.splice(1, 0, nuevaLetra); 
        actualizarLista('listaLetras2');
        limpiarInputs(['inputInsertar']);
    }
});

function actualizarLista(spanId) {
    document.getElementById(spanId).textContent = letras.join(' - ');
}

function limpiarInputs(ids) {
    ids.forEach(id => document.getElementById(id).value = '');
}
