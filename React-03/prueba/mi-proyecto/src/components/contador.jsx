import React, { useState } from 'react';

function Contador(){

    const [contador, setContador] = useState(0);

    const sumar = () => setContador(contador + 1);
    const restar = () => setContador(contador - 1);

    return <>
        <div class="centrar">
            <button class="restar" onClick={restar}>Restar</button>
            <h1 className='numero'>{contador}</h1>
            <button class="sumar" onClick={sumar}>Sumar</button>
        </div>
    </>
}
export default Contador;