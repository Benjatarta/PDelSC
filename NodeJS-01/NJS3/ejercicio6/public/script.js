//creo la funcion
function crearFormulario(tipoElemento, texto) {
    const creaciones = document.getElementById("creaciones");

    const nuevoElemento = document.createElement(tipoElemento);
    nuevoElemento.textContent = texto;

    creaciones.appendChild(nuevoElemento);
}
//le doy valor a constantes y luego lo muestro por pantalla
document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault();
    const nombre = event.target.nombre.value;
    const edad = event.target.edad.value;
    const genero = event.target.genero.value;
    
    crearFormulario("h3", "Datos:");
    crearFormulario("p", `Nombre: ${nombre}`);
    crearFormulario("p", `Edad: ${edad}`);
    crearFormulario("p", `Género: ${genero}`);
});