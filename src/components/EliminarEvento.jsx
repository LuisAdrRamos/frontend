import React, { useState } from "react";

const EliminarEvento = ({ eventosIniciales, onEliminar }) => {
    const [eventos, setEventos] = useState(eventosIniciales);

    const handleEliminar = (index) => {
        const nuevosEventos = eventos.filter((_, i) => i !== index);
        setEventos(nuevosEventos);
        if (onEliminar) {
            onEliminar(nuevosEventos);
        }
    };

    return (
        <div>
            <h2>Eliminar Evento</h2>
            {eventos.length > 0 ? (
                <ul>
                    {eventos.map((evento, index) => (
                        <li key={index}>
                            {evento.nombre} - {evento.mes}/{evento.dia}
                            <button onClick={() => handleEliminar(index)}>Eliminar</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay eventos disponibles.</p>
            )}
        </div>
    );
};

export default EliminarEvento;