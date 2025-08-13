function Tarjeta({Nombre, Apellido, Profesion, Imagen}){
    return <>
        <div className="tarj">
            <p>Nombre: {Nombre}</p>
            <p>Apellido: {Apellido}</p>
            <p>Profesión: {Profesion}</p>
            <img src={Imagen}/>
        </div>
    </>
}
export default Tarjeta;