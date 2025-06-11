// creo las constantes
const inputCampo = document.getElementById("numeros");
const lista = document.getElementById("lista");
const formulario = document.getElementById("formulario");
const mensaje = document.getElementById("mensaje");

// actualiza la lista
inputCampo.addEventListener("input", () => {
  const numeros = obtenerNumeros();

  // muestra la lista 
  lista.innerHTML = numeros.map(n => `<li>${n}</li>`).join("");

  if (numeros.length < 10 || numeros.length > 20) {
    mensaje.textContent = "Aún no cumplis con los requisitos";
  } else {
    mensaje.textContent = "Ya lo podes guardar";
  }
});


formulario.addEventListener("submit", function(e) {
  e.preventDefault(); 
  enviarNumeros();
});

// creo la funcion para obtener los numeros
function obtenerNumeros() {
  return inputCampo.value
    .trim()
    .split(/\s+/)
    .map(n => parseInt(n))
    .filter(n => !isNaN(n));
}

// creo la funcion
function enviarNumeros() {
  const numeros = obtenerNumeros();

  if (numeros.length < 10 || numeros.length > 20) {
    mensaje.textContent = "Te pasaste del máximo";
    return;
  }

// envia al sercidor los numeros
  fetch('/guardar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numeros })
  })
  .then(res => res.text())
  .then(msg => {
    mensaje.textContent = msg;
  });
}
