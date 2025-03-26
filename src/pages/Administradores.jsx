import React, { useState } from "react";
import CrearAdministradores from "../components/CrearAdministradores";
import ActualizarAdministradores from "../components/ActualizarAdministradores";
import BuscarAdministradores from "../components/BuscarAdministradores";
import EliminarAdministradores from "../components/EliminarAdministradores";

const administradoresIniciales = [
    {
        nombre: "Juan",
        apellido: "Pérez",
        direccion: "Calle Falsa 123",
        telefono: "123456789",
        email: "juan.perez@example.com",
        contraseña: "123456"
    },
    {
        nombre: "Ana",
        apellido: "Gómez",
        direccion: "Avenida Siempre Viva 456",
        telefono: "987654321",
        email: "ana.gomez@example.com",
        contraseña: "abcdef"
    }
];

const Administradores = () => {
    const [administradores, setAdministradores] = useState(administradoresIniciales);
    const [moduloActivo, setModuloActivo] = useState(null);

    const handleActualizarAdministradores = (nuevosAdministradores) => {
        setAdministradores(nuevosAdministradores);
    };

    return (
        <div>
            <h1>Gestión de Administradores</h1>
            <div>
                <button onClick={() => setModuloActivo("crear")}>Crear Administrador</button>
                <button onClick={() => setModuloActivo("actualizar")}>Actualizar Administrador</button>
                <button onClick={() => setModuloActivo("buscar")}>Buscar Administrador</button>
                <button onClick={() => setModuloActivo("eliminar")}>Eliminar Administrador</button>
            </div>

            <div style={{ marginTop: "20px" }}>
                {moduloActivo === "crear" && <CrearAdministradores />}
                {moduloActivo === "actualizar" && <ActualizarAdministradores />}
                {moduloActivo === "buscar" && <BuscarAdministradores administradores={administradores} />}
                {moduloActivo === "eliminar" && (
                    <EliminarAdministradores
                        administradoresIniciales={administradores}
                        onEliminar={handleActualizarAdministradores}
                    />
                )}
            </div>
        </div>
    );
};

export default Administradores;