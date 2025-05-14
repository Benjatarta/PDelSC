// Obtener elementos del DOM para colores
const formularioColores = document.getElementById("formularioColores");
const colorSelect = document.getElementById('colorSelect');
const listaColores = document.getElementById('listaColores');

// Array para almacenar los colores
let colores = [];

// Función para agregar los colores seleccionados
formularioColores.addEventListener('submit', function(event) {
    event.preventDefault();  // Evita la recarga de la página

    // Obtener los colores seleccionados
    const selectedOptions = Array.from(colorSelect.selectedOptions);
    const selectedColors = selectedOptions.map(option => option.value);

    // Agregar los colores al principio del array
    colores.unshift(...selectedColors); 

    // Mostrar los colores en la lista
    mostrarColores();
});

// Función para mostrar los colores en la lista
function mostrarColores() {
    listaColores.innerHTML = '';  // Limpiar la lista antes de mostrar los nuevos colores

    colores.forEach(color => {
        const li = document.createElement('li');
        li.textContent = color;
        li.classList.add('list-group-item');
        listaColores.appendChild(li);
    });
}

// Obtener elementos del DOM para tareas
const formularioTareas = document.getElementById("formularioTareas");
const inputTarea = document.getElementById("inputTarea");
const listaTareas = document.getElementById("listaTareas");

// Array para almacenar las tareas
let tareasUrgentes = [];

// Función para agregar una tarea urgente
formularioTareas.addEventListener('submit', function(event) {
    event.preventDefault();  // Evita la recarga de la página

    const tareaUrgente = inputTarea.value.trim();  // Obtener la tarea

    if (tareaUrgente) {
        tareasUrgentes.unshift(tareaUrgente);  // Agregar tarea urgente al principio
        mostrarTareas();
        inputTarea.value = "";  // Limpiar el campo de texto
    }
});

// Función para mostrar las tareas urgentes en la lista
function mostrarTareas() {
    listaTareas.innerHTML = '';  // Limpiar la lista antes de mostrar las nuevas tareas

    tareasUrgentes.forEach(tarea => {
        const li = document.createElement('li');
        li.textContent = tarea;
        li.classList.add('list-group-item');
        listaTareas.appendChild(li);
    });
}

// Obtener elementos del DOM para usuarios conectados
const formularioUsuarios = document.getElementById("formularioUsuarios");
const inputUsuario = document.getElementById("inputUsuario");
const listaUsuarios = document.getElementById("listaUsuarios");

// Array para almacenar los usuarios conectados
let usuariosConectados = [];

// Función para agregar un usuario conectado
formularioUsuarios.addEventListener('submit', function(event) {
    event.preventDefault();  // Evita la recarga de la página

    const nombreUsuario = inputUsuario.value.trim();  // Obtener el nombre del usuario

    if (nombreUsuario) {
        usuariosConectados.unshift(nombreUsuario);  // Agregar el usuario al principio del array
        mostrarUsuarios();
        inputUsuario.value = "";  // Limpiar el campo de texto
    }
});

// Función para mostrar los usuarios conectados en la lista
function mostrarUsuarios() {
    listaUsuarios.innerHTML = '';  // Limpiar la lista antes de mostrar los nuevos usuarios

    usuariosConectados.forEach(usuario => {
        const li = document.createElement('li');
        li.textContent = usuario;
        li.classList.add('list-group-item');
        listaUsuarios.appendChild(li);
    });
}
