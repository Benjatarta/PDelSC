// creo la clase
export class CZooAnimal {
    constructor(IdAnimal, nombre, JaulaNumero, IdTypeAnimal, peso) {
        this.idAnimal = IdAnimal;
        this.nombre = nombre;
        this.jaulaNumero = JaulaNumero;
        this.idTypeAnimal = IdTypeAnimal;
        this.peso = peso;
    }
    //creo los getters
    get idAnimal(){ 
        return this._IdAnimal; 
    }
    get nombre(){ 
        return this._nombre; 
    }
    get jaulaNumero(){ 
        return this._JaulaNumero; 
    }
    get idTypeAnimal() {
        return this._IdTypeAnimal; 
    }
    get peso() { 
        return this._peso; 
    } 

    //creo los setters con sus respectivas validaciones
    set idAnimal(value){
        this._IdAnimal = value;
    }
    set nombre(value) {
        if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/.test(value.trim())) {
            throw new Error("El nombre solo puede tener letras");
        }
        this._nombre = value;
    }
    set jaulaNumero(value) {
        if (!/^\d+$/.test(value.toString().trim())) {
            throw new Error("La jaula solo puede tener números");
        }
        const numero = parseInt(value, 10);
        if (isNaN(numero) || numero < 1 || numero > 5) {
            throw new Error("La jaula tiene que ser un número del 1 al 5");
        }
        this._JaulaNumero = value.toString();
    }
    set idTypeAnimal(value) {
        this._IdTypeAnimal = value;
    }
    set peso(value) {
        if (!/^\d+(\.\d+)?$/.test(value.toString().trim())) {
            throw new Error("El peso solo puede tener números");
        }
        
        const numero = parseFloat(value);
        if (isNaN(numero) || numero <= 0) {
            throw new Error("El peso tiene que ser un número mayor a 0");
        }
        this._peso = numero;
    }
}
