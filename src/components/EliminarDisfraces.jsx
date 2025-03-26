import React, { useState } from "react";

const EliminarDisfraces = ({ disfracesIniciales, onEliminar }) => {
    const [disfraces, setDisfraces] = useState(disfracesIniciales);

    const handleEliminar = (index) => {
        const nuevosDisfraces = disfraces.filter((_, i) => i !== index);
        setDisfraces(nuevosDisfraces);
        if (onEliminar) {
            onEliminar(nuevosDisfraces);
        }
    };

    return (
        <div>
            <h2>Eliminar Disfraces</h2>
            {disfraces.length > 0 ? (
                <ul>
                    {disfraces.map((disfraz, index) => (
                        <li key={index}>
                            <strong>Nombre:</strong> {disfraz.nombre} <br />
                            <strong>Talla:</strong> {disfraz.talla} <br />
                            <strong>Calidad:</strong> {disfraz.calidad} <br />
                            <strong>Categoría:</strong> {disfraz.categoria} <br />
                            <strong>Precio:</strong> ${disfraz.precio} <br />
                            <strong>Festividad:</strong> {disfraz.festividad} <br />
                            <strong>Descripción:</strong> {disfraz.descripcion} <br />
                            <button onClick={() => handleEliminar(index)}>Eliminar</button>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay disfraces disponibles.</p>
            )}
        </div>
    );
};

export default EliminarDisfraces;