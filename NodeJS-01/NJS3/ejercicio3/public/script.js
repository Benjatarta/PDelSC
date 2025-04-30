//creo una funcion para el primer boton
function boton(){
    const fondo = document.body;
    if (fondo.style.background === "white") {
        fondo.style.background = "rgb(152, 220, 136)";
} 
    else {
        fondo.style.background = "white";
}
} 
    //creo una funcion para el segundo boton
    document.addEventListener("keydown", function(event) {
        if (event.key === "c" || event.key === "C") {
                if (document.body.style.backgroundColor === "white"){
                document.body.style.backgroundColor = "#ffcccc";
            }
            else{
                document.body.style.backgroundColor = "white";
            }
        }
    });
    //creo una funcion para el tercer boton
    document.getElementById("boton3").addEventListener("mousemove", function() {
        this.style.backgroundColor = "#7e5b5b";  // Cambio de fondo cuando el mouse pasa sobre el botón
    });
    document.getElementById("boton3").addEventListener("mouseout", function() {
        this.style.backgroundColor = "#e34747";  // Vuelve al fondo original cuando el mouse sale del botón
    });
    //creo una funcion para el cuarto boton
    function play() {
        if (audio.paused) {
            audio.play();
        }
    }
    //creo una funcion para el quinto boton
    function pausar() {
        if (!audio.paused) {
            audio.pause();
        }
    }
    //creo una funcion para el sexto boton
    function volumen() {
        const audio = document.getElementById("audio");
        if (audio.volume === 1) {
            audio.volume = 0.3;
        } else {
            audio.volume = 1;
        }
    }
    //creo una funcion para determinar la cantidad de hijos del body
    function hijosBoton() {
        const body = document.body; 
        const hijos = body.getElementsByTagName('*'); 
        const resultado = document.getElementById("resultado");
        resultado.textContent = 'Número de hijos: ' + hijos.length; 
    }
        document.getElementById("botonhijo").addEventListener('click', hijosBoton);