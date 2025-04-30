//creo la funcion para el primer boton
function boton(){
    const fondo = document.body;
    if (fondo.style.background === "white") {
        fondo.style.background = "rgb(152, 220, 136)";
} 
    else {
        fondo.style.background = "white";
}
} 
    //creo la funcion para el boton dos
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
    //creo la funcion para el boton 3
    document.getElementById("boton3").addEventListener("mousemove", function() {
        this.style.backgroundColor = "#7e5b5b";  // Cambio de fondo cuando el mouse pasa sobre el botón
    });
    document.getElementById("boton3").addEventListener("mouseout", function() {
        this.style.backgroundColor = "#e34747";  // Vuelve al fondo original cuando el mouse sale del botón
    });
    //creo la funcion para la funcion del boton 4
    function play() {
        // Si el audio ya está en pausa, lo reproducimos
        if (audio.paused) {
            audio.play();
        }
    }
    //creo la funcion para la funcion del boton 5
    function pausar() {
        // Si el audio está reproduciéndose, lo detenemos
        if (!audio.paused) {
            audio.pause();
        }
    }
    //creo la funcion para la funcion del boton 6
    function volumen() {
        const audio = document.getElementById("audio");

        if (audio.volume === 1) {
          audio.volume = 0.3; // baja volumen
        } else {
          audio.volume = 1;   // vuelve al volumen normal
        }
    }