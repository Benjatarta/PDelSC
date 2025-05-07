const formulario = document.getElementById("formulario");
const listaDatos = document.getElementById("lista");

    formulario.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById("exampleInputEmail1").value;
        const contra = document.getElementById("exampleInputPassword1").value;

        const titulo = document.createElement('h2');
        const nuevoUsuario = document.createElement('li');
        titulo.textContent = `Lista de usuarios`;
        nuevoUsuario.textContent = `Email: ${email} - Contraseña: ${contra}`;
        listaDatos.appendChild(titulo);
        listaDatos.appendChild(nuevoUsuario);
        formulario.reset();
    });