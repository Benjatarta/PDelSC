//importo la clase
import { CZooAnimal } from "./CZooAnimal.js";

const animales = [];  // creo el array para almacenar los animales

document.getElementById("formulario").addEventListener("submit", function (e) {
    e.preventDefault();

    //limpio los errores cuando se cumple la condición
    document.getElementById("error-nombre").innerText = "";
    document.getElementById("error-jaula").innerText = "";
    document.getElementById("error-peso").innerText = "";
    //creo las constantes
    const nombre = document.getElementById("nombre").value;
    const jaula = document.getElementById("JaulaNumero").value;
    const tipo = document.getElementById("IdTypeAnimal").value;
    const peso = document.getElementById("peso").value;

    //intento agregar el animal
    try{
        const nuevoAnimal = new CZooAnimal(animales.length + 1, nombre, jaula, tipo, peso);
        animales.push(nuevoAnimal);
        
        // reseteo el formulario
        document.getElementById("formulario").reset();

        mostrarTablaAnimales();
    }
    //si falla, muestro el siguiente mensaje
    catch (error){
        const mensaje = error.message;

        if (mensaje.includes("letras")) {
            document.getElementById("error-nombre").innerText = mensaje;
        } else if (mensaje.includes("jaula")) {
            document.getElementById("error-jaula").innerText = mensaje;
        } else if (mensaje.includes("peso")) {
            document.getElementById("error-peso").innerText = mensaje;
        }
    }
});

// creo la funcion
function tipoTexto(tipo) {
    switch (tipo) {
        case "1": return "Félino";
        case "2": return "Ave";
        case "3": return "Reptil";
        case "4": return "Mamífero"
        default: return "Desconocido";
    }
}

document.getElementById("mostrarResultadosBtn").addEventListener("click", function () {
    mostrarResultados();
});

// creo la funcion para mostrar los resultados
function mostrarResultados() {
    let resultado = "";

    // creo las constantes para cada punto
    const jaula5PesoMenor3 = animales.filter(a => a.jaulaNumero === "5" && a.peso < 3);
    resultado += `<p>Animales en Jaula 5 con peso menor 3kg: ${jaula5PesoMenor3.length}</p>`;

    const felinosJaulas2a5 = animales.filter(a => a.idTypeAnimal === "1" && a.jaulaNumero >= "2" && a.JaulaNumero <= "5");
    resultado += `<p>Cantidad de félinos en Jaulas 2 a 5: ${felinosJaulas2a5.length}</p>`;

    const jaula4PesoMenor120 = animales.filter(a => a.jaulaNumero === "4" && a.peso < 120);
    const cantidadJaula4PesoMenor120 = jaula4PesoMenor120.length;

    if (cantidadJaula4PesoMenor120 > 0) {
        resultado += `<p>Animales en Jaula 4 con peso menor a 120kg: ${cantidadJaula4PesoMenor120}</p>`;
        resultado += "<ul>";
        jaula4PesoMenor120.forEach(animal => {
            resultado += `<li>${animal.nombre}</li>`;
        });
        resultado += "</ul>";
    } else {
        resultado += `<p>No hay animales en Jaula 4 con peso menor a 120kg.</p>`;
    }

    // muestro la tabla
    resultado += `
    <style>
    table {
        border-collapse: collapse;
        width: 100%;
    }
    th, td {
        padding: 1vh;
        text-align: center;
        border-bottom: 1px solid #ddd;
        }
    </style>
        <h1>Lista de Animales</h1>
        <table border="1" class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Jaula</th>
                    <th>Tipo</th>
                    <th>Peso</th>
                </tr>
            </thead>
            <tbody>
    `;

    // agrego cada animal a la tabla
    animales.forEach(animal => {
        resultado += `
            <tr>
                <td>${animal.idAnimal}</td>
                <td>${animal.nombre}</td>
                <td>${animal.jaulaNumero}</td>
                <td>${tipoTexto(animal.idTypeAnimal)}</td>
                <td>${animal.peso} kg</td>
            </tr>
        `;
    });

    resultado += `</tbody></table>`;
    
    // uso document.write para mostrar los resultados
    document.write(`<h1>Resultados</h1>${resultado}`);
}

