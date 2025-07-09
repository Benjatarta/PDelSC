//creo las constantes
const form = document.getElementById("formulario");
const lista = document.getElementById("lista");

//creo el formulario
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;

    //uso axios para devolver la ip
    axios.post("https://jsonplaceholder.typicode.com/users", {
        nombre: nombre,
        email: email
    })
        .then((response) => {
        lista.innerHTML += `<li>ID: ${response.data.id}</li>`;
    })
});