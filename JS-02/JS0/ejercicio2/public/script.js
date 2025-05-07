// Documento solo números y 8 dígitos
const documentoInput = document.getElementById("exampleInputDocumento");
documentoInput.addEventListener("input", function (e) {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 8);
});

// Formateo de la fecha (fuera del submit)
const nacimientoInput = document.getElementById("exampleInputNacimiento");
nacimientoInput.addEventListener("input", function (e) {
    let input = e.target.value.replace(/\D/g, "").substring(0, 8);
    let day = input.substring(0, 2);
    let month = input.substring(2, 4);
    let year = input.substring(4, 8);

    let formatted = day;
    if (input.length >= 3) formatted += "/" + month;
    if (input.length >= 5) formatted += "/" + year;

    e.target.value = formatted;
});

const tieneHijosSelect = document.getElementById("exampleInputHijos");
const cantidadHijosContainer = document.getElementById("cantidadHijosContainer");

tieneHijosSelect.addEventListener("change", function() {
    if (this.value === "Si") {
        cantidadHijosContainer.style.display = "block";
    } else {
        cantidadHijosContainer.style.display = "none";
        document.getElementById("cantidadHijos").value = "";
    }
});

function soloNumeros(input) {
    input.addEventListener("input", function (e) {
        e.target.value = e.target.value.replace(/\D/g, ""); // Elimina todo lo que no sea dígito
    });
}
soloNumeros(document.getElementById("exampleInputTelefono"));
soloNumeros(document.getElementById("cantidadHijos"));

let tituloAgregado = false;

// Manejo del formulario (submit)
const formulario = document.getElementById("formulario");
const listaDatos = document.getElementById("lista");
const mensaje = document.getElementById("mensaje");

formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById("exampleInputName").value;
    const apellido = document.getElementById("exampleInputApellido").value;
    const edad = parseInt(document.getElementById("exampleInputEdad").value);
    const sexo = document.querySelector('input[name="sexo"]:checked').value;
    const email = document.getElementById("exampleInputEmail1").value;
    const nacimiento = document.getElementById("exampleInputNacimiento").value;
    const documento = documentoInput.value;
    const estado = document.getElementById("exampleInputEstado").value;
    const nacionalidad = document.getElementById("exampleInputNacionalidad").value;
    const telefono = document.getElementById("exampleInputTelefono").value;
    const hijos = document.getElementById("exampleInputHijos").value;
    const cantidadHijos = document.getElementById("cantidadHijos").value;

    // Validar edad
    if (edad > 120 || edad < 0 || isNaN(edad)) {
        mensaje.textContent = "La edad no es válida.";
        mensaje.className = "alert alert-danger";
        return;
    }

    // Validar fecha real
    function fechaValida(fecha) {
        const [dia, mes, anio] = fecha.split("/").map(Number);
        const fechaObj = new Date(`${anio}-${mes}-${dia}`);
        return (
            fechaObj.getDate() === dia &&
            fechaObj.getMonth() + 1 === mes &&
            fechaObj.getFullYear() === anio &&
            fechaObj <= new Date()
        );
    }
    if (!fechaValida(nacimiento)) {
        mensaje.textContent = "La fecha de nacimiento no es válida.";
        mensaje.className = "alert alert-danger";
        return;
    }

    mensaje.textContent = "Se guardó el usuario correctamente.";
    mensaje.className = "alert alert-success";

    const nuevoUsuario = document.createElement('li');

    let hijosTexto = hijos === "Si" ? `Sí (${cantidadHijos})` : "No";
    nuevoUsuario.textContent = `Nombre: ${nombre} | Apellido: ${apellido} | Edad: ${edad} | Nacimiento: ${nacimiento} | Sexo: ${sexo} | Email: ${email} | Documento: ${documento} | Estado civil: ${estado} | Nacionalidad: ${nacionalidad} | Teléfono: ${telefono} | Hijos: ${hijosTexto}`;
    
    if (!tituloAgregado) {
        const titulo = document.createElement('h2');
        titulo.textContent = `Lista de usuarios`;
        listaDatos.appendChild(titulo);
        tituloAgregado = true;
    }

    if (!nombre || !apellido || !edad || !nacimiento || !sexo || !email || !documento || !estado || !nacionalidad || !telefono || !hijosTexto) {
        mensaje.textContent = "Por favor, completá todos los campos.";
        mensaje.className = "alert alert-danger";
        return;
    }

    listaDatos.appendChild(nuevoUsuario);
    formulario.reset();
});
