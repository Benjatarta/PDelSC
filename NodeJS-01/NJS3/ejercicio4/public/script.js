//creo la funcion para el primer boton
function crearA(){
    const enlace = document.createElement("a");

    enlace.href = "https://es.dragon-ball-official.com/";
    enlace.textContent = "Ir a Dragon ball";
    enlace.target = "_blank";
    enlace.id = "enlace1";
    const grid2 = document.getElementById("grid2");
    grid2.appendChild(enlace);
}
//creo la funcion para el segundo boton
function crearA2(){
    const enlace = document.createElement("a");

    enlace.href = "https://www.valeria-patissiere.com/";
    enlace.textContent = "Ir a pasteleria";
    enlace.target = "_blank";
    enlace.id = "enlace2";
    const grid2 = document.getElementById("grid2");
    grid2.appendChild(enlace);
}
//creo la funcion para el tercero boton
function crearA3(){
    const enlace = document.createElement("a");

    enlace.href = "https://chatgpt.com/?model=auto";
    enlace.textContent = "Ir a chatgpt";
    enlace.target = "_blank";
    enlace.id = "enlace3";
    const grid2 = document.getElementById("grid2");
    grid2.appendChild(enlace);
}
//creo la funcion para el cuarto boton
function crearA4(){
    const enlace = document.createElement("a");

    enlace.href = "https://www.netflix.com/";
    enlace.textContent = "Ir a netflix";
    enlace.target = "_blank";
    enlace.id = "enlace4";
    const grid2 = document.getElementById("grid2");
    grid2.appendChild(enlace);
}
//creo la funcion para el quinto boton
function crearA5(){
    const enlace = document.createElement("a");

    enlace.href = "https://open.spotify.com/intl-es/";
    enlace.textContent = "Ir a spotify";
    enlace.target = "_blank";
    enlace.id = "enlace5";
    const grid2 = document.getElementById("grid2");
    grid2.appendChild(enlace);
}
//creo la funcion para cambiar los links
function cambiarA() {
    const enlace = document.getElementById("enlace1");
    const enlace2 = document.getElementById("enlace2");
    const enlace3 = document.getElementById("enlace3");
    const enlace4 = document.getElementById("enlace4");
    const enlace5 = document.getElementById("enlace5");
    if (enlace) {
        enlace.href = "https://www.youtube.com/watch?v=IpDr3I1X7Os";
        enlace.textContent = "Ir a youtube";
    } else {
        alert("Aún no creaste el botón");
    }
    if (enlace2) {
        enlace2.href = "https://discord.com/";
        enlace2.textContent = "Ir a discord";
    } else {
        alert("Aún no creaste el botón");
    }
    if (enlace3) {
        enlace3.href = "https://store.steampowered.com/?l=spanish";
        enlace3.textContent = "Ir a steam";
    } else {
        alert("Aún no creaste el botón");
    }
    if (enlace4) {
        enlace4.href = "https://gemini.google.com/app?hl=es";
        enlace4.textContent = "Ir a gemini";
    } else {
        alert("Aún no creaste el botón");
    }
    if (enlace5) {
        enlace5.href = "https://fonts.google.com/";
        enlace5.textContent = "Ir a google fonts";
    } else {
        alert("Aún no creaste el botón");
    }
}