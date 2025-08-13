import React, { useState } from 'react';

function Lista(){
    const [tareas, setTareas] = useState([]);
    const [nuevaTarea, setNuevaTarea] = useState();

    const agregarTarea = () => {
        if (nuevaTarea.trim() === '') return;

        const tarea = {
        id: Date.now(),
        texto: nuevaTarea,
        completada: false
        };

        setTareas([...tareas, tarea]);
        setNuevaTarea('');
    };

    const Tilde = (id) => {
        setTareas(tareas.map(t =>
        t.id === id ? { ...t, completada: !t.completada } : t
        ));
    };
        return <>
            <div className='recuadro'>
        <h2>Lista de Tareas</h2>
        <input type="text" value={nuevaTarea} onChange={(e) => setNuevaTarea(e.target.value)} placeholder="Escribí una tarea"/>
        <button onClick={agregarTarea}>Agregar</button>

        <ul>
            {tareas.map((tarea) => (
            <li className='lista' key={tarea.id}>
                <label>
                <input type="checkbox" checked={tarea.completada} onChange={() => Tilde(tarea.id)}/>
                {tarea.texto}
                </label>
            </li>
            ))}
        </ul>
        </div>
        </>
}
export default Lista;