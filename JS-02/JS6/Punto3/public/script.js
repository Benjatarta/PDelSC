//creo el array vacio junto a las constantes
let usuarios = [];
const contenido = document.getElementById("contenido");
const mostrar = document.getElementById("mostrar");
const buscar = document.getElementById("buscar");
const sugerencias = document.getElementById("sugerencias");

mostrar.addEventListener("click", mostrarDatosAPI);

//creo la funcion para guardar los usuarios de la API
function mostrarDatosAPI() {
    fetch("https://jsonplaceholder.typicode.com/users")
    .then(res => res.json())
    .then(data => {
        usuarios = data;
        mostrarUsuarios(usuarios);
        buscador();
    })
}
//creo la funcion para mostrar los usuarios guardados
function mostrarUsuarios(lista) {
    contenido.innerHTML = "";
    lista.forEach(usuario => {
        contenido.innerHTML += `
        <div>
            <div>
            <h4>${usuario.name}</h5>
            <p>${usuario.email}</p>
            </div>
        </div>
        `;
    });
}

//creo la funcion para el buscador
function buscador() {
    buscar.addEventListener("input", () => {
    const texto = buscar.value.toLowerCase();
    sugerencias.innerHTML = "";

    const resultados = usuarios.filter(usuarios =>
        usuarios.name.toLowerCase().includes(texto)
    );

    //recorro el array para ver cual coincide
    resultados.forEach(usuario => {
        const item = document.createElement("button");
        item.className = "list-group-item list-group-item-action";
        item.textContent = usuario.name;
        item.addEventListener("click", () => {
        buscar.value = usuario.name;
        sugerencias.innerHTML = "";
        mostrarUsuarios([usuario]);
    });
    //añado las posibles sugerencias
        sugerencias.appendChild(item);
    });
});
}
