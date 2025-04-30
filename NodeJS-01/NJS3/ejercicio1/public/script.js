//creo la funcion para la funcion del boton 1
function texto(){
    const info = document.getElementById("text");
    if (info.style.display === "none") {
        info.style.display = "block";
      } else {
        info.style.display = "none";
      }
} 
//creo la funcion para la funcion del boton 2
function texto2(){
  const info = document.getElementById("text");
  if (info.textContent === "Hola DOM") {
    info.textContent = "Chau DOM"
  } else {
    info.textContent = "Hola DOM";
  }
} 
//creo la funcion para la funcion del boton 3
function texto3(){
  const info = document.getElementById("text");
  if (info.style.color === "black") {
      info.style.color = "red";
    } else {
      info.style.color = "black";
    }
} 
//creo la funcion para la funcion del boton 4
function texto4(){
  const imagen = document.getElementById("img");
  if (imagen.style.display === "none") {
      imagen.style.display = "block";
    } else {
      imagen.style.display = "none";
    }
} 
//creo la funcion para la funcion del boton 5
function texto5(){
  const imagen = document.getElementById("img");
  if (imagen.src === "https://www.ole.com.ar/2025/04/27/4e4VRKfSG_1290x760__1.jpg") {
      imagen.src = "https://media.diariouno.com.ar/p/ea5ab12f170c85c1cf036f68fb0e29fc/adjuntos/298/imagenes/009/540/0009540464/1200x0/smart/franco-mastantuonojpg.jpg";
    } else {
      imagen.src = "https://www.ole.com.ar/2025/04/27/4e4VRKfSG_1290x760__1.jpg";
    }
} 
//creo la funcion para la funcion del boton 6
function texto6(){
  const imagen = document.getElementById("img");
  if (imagen.style.height === "30vh" && imagen.style.width === "25vw") {
      imagen.style.height = "35vh";
      imagen.style.width = "30vw";
    } else {
      imagen.style.height = "30vh";
      imagen.style.width = "25vw";
    }
} 
