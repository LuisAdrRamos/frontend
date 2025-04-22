import React, { useState } from "react";
import CrearAdministradores from "../components/CrearAdministradores";
import ActualizarAdministradores from "../components/ActualizarAdministradores";
// import BuscarAdministradores from "../components/BuscarAdministradores";
// import EliminarAdministradores from "../components/EliminarAdministradores";
import "../styles/Admin.css";

const Administradores = () => {
    const [moduloActivo, setModuloActivo] = useState(null);

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
            </div>

            <div className="admin-module-container">
                {moduloActivo === "crear" && <CrearAdministradores />}
                {moduloActivo === "actualizar" && <ActualizarAdministradores />}
            </div>
        </div>
    );
};

export default Administradores;
