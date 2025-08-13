import { useState } from "react";

function Formulario() {
    const [nombre, setNombre] = useState("");
    const [mensaje, setMensaje] = useState(""); 

    const form = (event) => {
    event.preventDefault();
    setMensaje(`Bienvenido ${nombre}`);
    setNombre(""); 
};

    return (
    <div className="contenedor">
        <h2>Formulario</h2>
        <form onSubmit={form}>
            <input type="text" placeholder="Escribí tu nombre" value={nombre} onChange={(event) => setNombre(event.target.value)}/>
            <button type="submit">Enviar</button>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
);}

export default Formulario;