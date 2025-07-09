document.getElementById("mostrar").addEventListener("click", mostrarDatosAPI, true);
let contenido = document.querySelector("#contenido");

//creo la funcion para mostrar los datos de la API con fetch
function mostrarDatosAPI(){
    fetch("http://localhost:3001/api/alumnos")
    .then(res => res.json())
    .then(data => {
        contenido.innerHTML = "";
        data.forEach(usuario => {
        contenido.innerHTML +=  ` 
        <p>Nombre: ${usuario.nombre}</p>
        <p>Email: ${usuario.mail}"</p>
        <br>
        `;
    })
}
)}