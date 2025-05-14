// creo las constantes
const formularioColores = document.getElementById("formularioColores");
const colorSelect = document.getElementById('colorSelect');
const listaColores = document.getElementById('listaColores');
let colores = [];

// funcion para agregar colores
formularioColores.addEventListener('submit', function(event) {
    event.preventDefault();  
    const selectedOptions = Array.from(colorSelect.selectedOptions);
    const selectedColors = selectedOptions.map(option => option.value);

    colores.unshift(...selectedColors); 

    mostrarColores();
});

// funcion para mostrar la lista de colores
function mostrarColores() {
    listaColores.innerHTML = '';  

    colores.forEach(color => {
        const li = document.createElement('li');
        li.textContent = color;
        li.classList.add('list-group-item');
        listaColores.appendChild(li);
    });
}

// creo las constantes
const formularioTareas = document.getElementById("formularioTareas");
const inputTarea = document.getElementById("inputTarea");
const listaTareas = document.getElementById("listaTareas");
let tareasUrgentes = [];

// función para agregar una tarea urgente
formularioTareas.addEventListener('submit', function(event) {
    event.preventDefault();  

    const tareaUrgente = inputTarea.value.trim();  

    if (tareaUrgente) {
        tareasUrgentes.unshift(tareaUrgente);
        mostrarTareas();
        inputTarea.value = "";  
    }
});

// función para mostrar las tareas urgentes en la lista
function mostrarTareas() {
    listaTareas.innerHTML = '';

    tareasUrgentes.forEach(tarea => {
        const li = document.createElement('li');
        li.textContent = tarea;
        li.classList.add('list-group-item');
        listaTareas.appendChild(li);
    });
}

// creo las constantes
const formularioUsuarios = document.getElementById("formularioUsuarios");
const inputUsuario = document.getElementById("inputUsuario");
const listaUsuarios = document.getElementById("listaUsuarios");
let usuariosConectados = [];

// función para agregar un usuario conectado
formularioUsuarios.addEventListener('submit', function(event) {
    event.preventDefault();  

    const nombreUsuario = inputUsuario.value.trim(); 
    if (nombreUsuario) {
        usuariosConectados.unshift(nombreUsuario); 
        mostrarUsuarios();
        inputUsuario.value = ""; 
    }
});

// función para mostrar los usuarios conectados en la lista
function mostrarUsuarios() {
    listaUsuarios.innerHTML = ''; 

    usuariosConectados.forEach(usuario => {
        const li = document.createElement('li');
        li.textContent = usuario;
        li.classList.add('list-group-item');
        listaUsuarios.appendChild(li);
    });
}
