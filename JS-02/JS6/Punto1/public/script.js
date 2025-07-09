document.getElementById("mostrar").addEventListener("click", mostrarDatosAPI, true);
let contenido = document.querySelector("#contenido");

//creo la funcion para mostrar los datos de la API con fetch
function mostrarDatosAPI(){
    fetch("https://jsonplaceholder.typicode.com/users")
    .then(res => res.json())
    .then(data => {
        contenido.innerHTML = "";
        data.forEach(usuario => {
        contenido.innerHTML +=  ` 
        <p>Nombre: ${usuario.name}</p>
        <p>Email: ${usuario.email}"</p>
        <br>
        `;
    })
}
)}
//creo la funcion para mostrar los datos de la API con axios
document.getElementById("mostrarA").addEventListener("click", mostrarDatosAPIAxios, true);
let contenidoAxios = document.querySelector("#contenidoAxios");
function mostrarDatosAPIAxios(){
    axios.get("https://jsonplaceholder.typicode.com/users")
    .then(res => {
        const data = res.data;
        contenidoAxios.innerHTML = "";
        data.forEach(usuario => {
        contenidoAxios.innerHTML +=  ` 
        <p>Nombre: ${usuario.name}</p>
        <p>Email: ${usuario.email}"</p>
        <br>
        `;
    })
}
)}
