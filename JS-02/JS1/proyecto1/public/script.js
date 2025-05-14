const formulario = document.getElementById("formulario");
const listaDatos = document.getElementById("lista");
let frutas = [];
let nombreAmigos = [];
let numeros = [];

formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    const arrayFruta = document.getElementById("exampleInputFruta").value;
    const amigos = document.getElementById("exampleInputAmigos").value;
    const numero = parseInt(document.getElementById("exampleInputNumero").value);  // Asegúrate de convertir el número a entero

    frutas.push(arrayFruta);
    nombreAmigos.push(amigos);

    // se verifica si el numero anterior es mayor o menor que el ingresado
    if (numeros.length > 0 && numero < numeros[numeros.length - 1]) {
        alert("El número debe ser mayor o igual que el anterior");
    } else {
        numeros.push(numero);
    }
    if (listaDatos.children.length === 0) {
        const titulo = document.createElement('h2');
        titulo.textContent = `Lista`;
        listaDatos.appendChild(titulo);
    }

    //muestra los datos en la lista
    const nuevoUsuario = document.createElement('li');
    nuevoUsuario.textContent = `Frutas: ${arrayFruta} - Amigos: ${amigos}`;
    listaDatos.appendChild(nuevoUsuario);

    //muestra el número más reciente
    const ultimoNumero = document.createElement("li");
    ultimoNumero.textContent = numeros[numeros.length - 1];
    listaDatos.appendChild(ultimoNumero);

    formulario.reset();
});
