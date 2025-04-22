import React, { useState } from "react";
import CrearEventos from "../components/CrearEventos";
import EditarEventos from "../components/EditarEventos";
// import BuscarEvento from "../components/BuscarEvento";
// import EliminarEvento from "../components/EliminarEvento";
import "../styles/Admin.css";

const Eventos = () => {
    const [moduloActivo, setModuloActivo] = useState(null);

    return (
        <div className="admin-container">
            <h1 className="admin-title">Gestión de Eventos</h1>
            <div className="admin-buttons-container">
                <button className="admin-button button-crear" onClick={() => setModuloActivo("crear")}>Crear Evento</button>
                <button className="admin-button button-actualizar" onClick={() => setModuloActivo("editar")}>Editar Evento</button>
            </div>

            <div 
                className="admin-module-container"
                style={{ marginTop: "20px" }}>

                    {moduloActivo === "crear" && <CrearEventos />}
                    {moduloActivo === "editar" && <EditarEventos />}
            </div>
        </div>
    );
};

export default Eventos;