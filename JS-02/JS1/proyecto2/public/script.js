//creo las constantes
const formularioAnimal = document.getElementById("formularioAnimal");
const formularioCompra = document.getElementById("formularioCompra");
const formularioBucle = document.getElementById("formularioBucle");
const listaDatosAnimales = document.getElementById("lista");
const listaDatosCompras = document.getElementById("listaCompras");
const listaDatosBucle = document.getElementById("listaBucle");
const eliminarBtn = document.getElementById("eliminarBtn");
const eliminarCompra = document.getElementById("eliminarCompra");
const eliminarBucle = document.getElementById("eliminarBucle");

let animales = []; 
let listaCompras = [];
let arrayBucle = []; 

formularioAnimal.addEventListener('submit', function(event) {
    event.preventDefault();

    const inputAnimal = document.getElementById("exampleInputAnimal");
    const animal = inputAnimal.value.trim();  

    if (animal) {
        animales.push(animal);
        mostrarAnimales();
        inputAnimal.value = "";  
    }
});

formularioCompra.addEventListener('submit', function(event) {
    event.preventDefault();  

    const inputCompra = document.getElementById("inputForm2");
    const compra = inputCompra.value.trim();  

    if (compra) {
        listaCompras.push(compra);
        mostrarCompras();
        inputCompra.value = "";  
    }
});

formularioBucle.addEventListener('submit', function(event) {
    event.preventDefault();  

    const inputBucle = document.getElementById("inputForm3");
    const bucle = inputBucle.value.trim();  

    if (bucle) {
        arrayBucle.push(bucle);
        mostrarBucle();  
        inputBucle.value = ""; 
    }
});

// mostrar animales en la lista
function mostrarAnimales() {
    listaDatosAnimales.innerHTML = ""; 
    animales.forEach(function(animal) {
        const li = document.createElement("li");
        li.textContent = animal;
        li.classList.add("list-group-item");
        listaDatosAnimales.appendChild(li);
    });
}

// mostrar compras en la lista
function mostrarCompras() {
    listaDatosCompras.innerHTML = "";  

    listaCompras.forEach(function(compra) {
        const li = document.createElement("li");
        li.textContent = compra;
        li.classList.add("list-group-item");
        listaDatosCompras.appendChild(li);
    });
}

// mostrar bucles
function mostrarBucle() {
    listaDatosBucle.innerHTML = ""; 

    arrayBucle.forEach(function(bucle) {
        const li = document.createElement("li");
        li.textContent = bucle;
        li.classList.add("list-group-item");
        listaDatosBucle.appendChild(li);
    });
}

// eliminar el ultimo animal
eliminarBtn.addEventListener("click", function() {
    if (animales.length > 0) {
        animales.pop(); 
        mostrarAnimales();  
    }
});

// eliminar la ultima compra
eliminarCompra.addEventListener("click", function() {
    if (listaCompras.length > 0) {
        listaCompras.pop(); 
        mostrarCompras();  
    }
});

// elimina todo
eliminarBucle.addEventListener("click", function() {
    while (arrayBucle.length > 0) {
        arrayBucle.pop();  
    }
    mostrarBucle(); 
});
