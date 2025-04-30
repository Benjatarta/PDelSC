    document.getElementById("boton").addEventListener("click", function(event) {
        event.preventDefault();
    const email = document.getElementById("exampleInputEmail1").value;
    const contra = document.getElementById("exampleInputPassword1").value;

    alert(`Email: ${email} \nContraseña: ${contra}`);
});