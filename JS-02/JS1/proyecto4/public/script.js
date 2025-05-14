// Obtener elementos del DOM para los números
const formularioNumero = document.getElementById("formularioNumero");
const inputNumero = document.getElementById("inputNumero");
const listaNumeros = document.getElementById("listaNumeros");
const eliminarNumeroBtn = document.getElementById("eliminarNumero");

// Array para almacenar los números enteros
let numeros = [];

// Función para manejar el envío de un número entero
formularioNumero.addEventListener('submit', function(event) {
    event.preventDefault();  // Evita la recarga de la página

    const numero = parseInt(inputNumero.value.trim(), 10);  // Obtener el número ingresado

    if (!isNaN(numero)) {
        numeros.push(numero);  // Agregar el número al final del array
        mostrarNumeros();
        inputNumero.value = "";  // Limpiar el campo de texto
    }
});

// Función para eliminar el primer número del array
eliminarNumeroBtn.addEventListener('click', function() {
    if (numeros.length > 0) {
        numeros.shift();  // Eliminar el primer número del array
        mostrarNumeros();  // Actualizar la lista
    }
});

// Función para mostrar los números en la lista
function mostrarNumeros() {
    listaNumeros.innerHTML = '';  // Limpiar la lista antes de mostrar los nuevos números

    numeros.forEach(function(numero) {
        const li = document.createElement('li');
        li.textContent = numero;
        li.classList.add('list-group-item');
        listaNumeros.appendChild(li);
    });
}

// Obtener elementos del DOM para los mensajes de chat
const formularioMensaje = document.getElementById("formularioMensaje");
const inputMensaje = document.getElementById("inputMensaje");
const listaMensajes = document.getElementById("listaMensajes");
const eliminarMensajeBtn = document.getElementById("eliminarMensaje");

// Array para almacenar los mensajes de chat
let mensajes = [];

// Función para manejar el envío de un mensaje
formularioMensaje.addEventListener('submit', function(event) {
    event.preventDefault();  // Evita la recarga de la página

    const mensaje = inputMensaje.value.trim();  // Obtener el mensaje ingresado

    if (mensaje) {
        mensajes.push(mensaje);  // Agregar el mensaje al final del array
        mostrarMensajes();
        inputMensaje.value = "";  // Limpiar el campo de texto
    }
});

// Función para eliminar el primer mensaje del array
eliminarMensajeBtn.addEventListener('click', function() {
    if (mensajes.length > 0) {
        mensajes.shift();  // Eliminar el primer mensaje del array
        mostrarMensajes();  // Actualizar la lista
    }
});

// Función para mostrar los mensajes en la lista
function mostrarMensajes() {
    listaMensajes.innerHTML = '';  // Limpiar la lista antes de mostrar los nuevos mensajes

    mensajes.forEach(function(mensaje) {
        const li = document.createElement('li');
        li.textContent = mensaje;
        li.classList.add('list-group-item');
        listaMensajes.appendChild(li);
    });
}
// Obtener elementos del DOM
const formularioCliente = document.getElementById("formularioCliente");
const inputCliente = document.getElementById("inputCliente");
const listaClientes = document.getElementById("listaClientes");
const atenderClienteBtn = document.getElementById("atenderCliente");

// Array para almacenar la cola de clientes
let colaClientes = [];

// Función para manejar el envío de un nuevo cliente
formularioCliente.addEventListener('submit', function(event) {
    event.preventDefault();  // Evita la recarga de la página

    const cliente = inputCliente.value.trim();  // Obtener el nombre del cliente

    if (cliente) {
        colaClientes.push(cliente);  // Agregar el cliente al final de la cola
        mostrarCola();  // Actualizar la lista de la cola
        inputCliente.value = "";  // Limpiar el campo de texto
    }
});

// Función para atender al primer cliente (eliminarlo de la cola)
atenderClienteBtn.addEventListener('click', function() {
    if (colaClientes.length > 0) {
        const clienteAtendido = colaClientes.shift();  // Eliminar el primer cliente de la cola
        alert(`Cliente atendido: ${clienteAtendido}`);  // Mostrar alerta con el nombre del cliente atendido
        mostrarCola();  // Actualizar la lista de la cola
    } else {
        alert("No hay clientes en la cola para atender.");
    }
});

// Función para mostrar la cola de clientes en la lista
function mostrarCola() {
    listaClientes.innerHTML = '';  // Limpiar la lista antes de mostrar los nuevos clientes

    colaClientes.forEach(function(cliente, index) {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${cliente}`;  // Mostrar la posición y el nombre del cliente
        li.classList.add('list-group-item');
        listaClientes.appendChild(li);
    });
}
