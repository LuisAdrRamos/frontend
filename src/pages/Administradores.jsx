import React, { useState } from "react";
import CrearAdministradores from "../components/CrearAdministradores";
import ActualizarAdministradores from "../components/ActualizarAdministradores";
import BuscarAdministradores from "../components/BuscarAdministradores";
import EliminarAdministradores from "../components/EliminarAdministradores";
import "../styles/Admin.css";

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
        <div className="admin-container">
            <h1 className="admin-title">Gestión de Administradores</h1>
            <div className="admin-buttons-container">
                <button className="admin-button button-crear" onClick={() => setModuloActivo("crear")}>
                    Crear Administrador
                </button>
                <button className="admin-button button-actualizar" onClick={() => setModuloActivo("actualizar")}>
                    Actualizar Administrador
                </button>
                <button className="admin-button button-buscar" onClick={() => setModuloActivo("buscar")}>
                    Buscar Administrador
                </button>
                <button className="admin-button button-eliminar" onClick={() => setModuloActivo("eliminar")}>
                    Eliminar Administrador
                </button>
            </div>

            <div className="admin-module-container">
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
