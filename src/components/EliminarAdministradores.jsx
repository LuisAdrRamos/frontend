import React, { useState } from "react";

const EliminarAdministradores = ({ administradoresIniciales, onEliminar }) => {
    const [administradores, setAdministradores] = useState(administradoresIniciales);

    const handleEliminar = (index) => {
        const nuevosAdministradores = administradores.filter((_, i) => i !== index);
        setAdministradores(nuevosAdministradores);
        if (onEliminar) {
            onEliminar(nuevosAdministradores);
        }
    };

    return (
        <div>
            <h2>Eliminar Administradores</h2>
            {administradores.length > 0 ? (
                <ul>
                    {administradores.map((admin, index) => (
                        <li key={index}>
                            <strong>Nombre:</strong> {admin.nombre} <br />
                            <strong>Apellido:</strong> {admin.apellido} <br />
                            <strong>Dirección:</strong> {admin.direccion} <br />
                            <strong>Teléfono:</strong> {admin.telefono} <br />
                            <strong>Email:</strong> {admin.email} <br />
                            <button onClick={() => handleEliminar(index)}>Eliminar</button>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay administradores disponibles.</p>
            )}
        </div>
    );
};

export default EliminarAdministradores;