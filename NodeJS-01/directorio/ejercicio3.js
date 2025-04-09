//creo funciones dandoles un parametro
function suma (a, b){
    return a+b;
}
function resta (a, b){
    return a-b;
}
function multi (a, b){
    return a*b;
}
function division (a, b){
    return a/b;
}

//creo variables y llamo a la funcion creada anteriormente
let resultadosuma = suma (4, 5);

let resultadoresta = resta (3,6);

let resultadomulti = multi (2, 7);

let resultadodivision = division (20, 4);

//muestro en terminal el resultado de las variables
    console.log(resultadosuma, resultadoresta, resultadomulti, resultadodivision);