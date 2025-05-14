//creo la funcion para decodificar
function decodificar(mensaje) {
    return mensaje.replace(/\(([^()]*)\)/g, (_, texto) => texto.split('').reverse().join(''));
}

document.getElementById('formMensaje').addEventListener('submit', function (e) {
    e.preventDefault();
    const input = document.getElementById('inputMensaje').value;
    document.getElementById('resultadoMensaje').textContent = decodificar(input);
});
