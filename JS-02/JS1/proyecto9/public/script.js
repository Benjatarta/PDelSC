// Ejercicio 1: Saludo a cada nombre
const formNombres = document.getElementById("formNombres");
const inputNombre = document.getElementById("inputNombre");
const resultadoNombres = document.getElementById("resultadoNombres");
let nombres = [];

formNombres.addEventListener("submit", function (e) {
  e.preventDefault();
  if (inputNombre.value.trim() !== "") {
    nombres.push(inputNombre.value.trim());
    resultadoNombres.innerHTML = "";
    nombres.forEach(nombre => {
      const p = document.createElement("p");
      p.textContent = `Hola, ${nombre}!`;
      resultadoNombres.appendChild(p);
    });
    inputNombre.value = "";
  }
});

// Ejercicio 2: Doble de cada número
const formNumeros = document.getElementById("formNumeros");
const inputNumero = document.getElementById("inputNumero");
const resultadoNumeros = document.getElementById("resultadoNumeros");
let numeros = [];

formNumeros.addEventListener("submit", function (e) {
  e.preventDefault();
  const numero = Number(inputNumero.value);
  if (!isNaN(numero)) {
    numeros.push(numero);
    resultadoNumeros.innerHTML = "";
    numeros.forEach(n => {
      const p = document.createElement("p");
      p.textContent = `El doble de ${n} es ${n * 2}`;
      resultadoNumeros.appendChild(p);
    });
    inputNumero.value = "";
  }
});

// Ejercicio 3: Mostrar nombre y edad
const formPersonas = document.getElementById("formPersonas");
const inputPersonaNombre = document.getElementById("inputPersonaNombre");
const inputPersonaEdad = document.getElementById("inputPersonaEdad");
const resultadoPersonas = document.getElementById("resultadoPersonas");
let personas = [];

formPersonas.addEventListener("submit", function (e) {
  e.preventDefault();
  const nombre = inputPersonaNombre.value.trim();
  const edad = Number(inputPersonaEdad.value);
  if (nombre && !isNaN(edad)) {
    personas.push({ nombre, edad });
    resultadoPersonas.innerHTML = "";
    personas.forEach(persona => {
      const p = document.createElement("p");
      p.textContent = `${persona.nombre} tiene ${persona.edad} años.`;
      resultadoPersonas.appendChild(p);
    });
    inputPersonaNombre.value = "";
    inputPersonaEdad.value = "";
  }
});
