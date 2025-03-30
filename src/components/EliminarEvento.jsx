import React, { useState } from "react";
import "../styles/c_ac_bsc_elim_admin.css"; // Asegúrate de importar el archivo CSS

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
            <h2 className="tittle-eliminarev">Eliminar Evento</h2>
            {eventos.length > 0 ? (
                <ul className="custom-list">
                    {eventos.map((evento, index) => (
                        <li key={index} className="form-content2">
                            {evento.nombre} - {evento.mes}/{evento.dia}
                            <button onClick={() => handleEliminar(index)} className="form-button_eliminar1">Eliminar</button>
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
