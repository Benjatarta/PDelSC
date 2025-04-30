//creamos la funcion
function crearElemento(tipoElemento, texto) {
    const creaciones = document.getElementById("creaciones");
    
    // Crear el elemento que necesitamos
    const nuevoElemento = document.createElement(tipoElemento);
    nuevoElemento.textContent = texto; // Asignar el texto al elemento

    // Añadir los nuevos elementos
    creaciones.appendChild(nuevoElemento);
}
    //creamos los h1, p y div
    document.getElementById("boton1").addEventListener("click", function() {
        crearElemento("h1", "¡Nuevo H1 creado!");
    });

    document.getElementById("boton2").addEventListener("click", function() {
        crearElemento("p", "¡Nuevo párrafo creado!");
    });

    document.getElementById("boton3").addEventListener("click", function() {
        crearElemento("div", "¡Nuevo Div creado!");
    });