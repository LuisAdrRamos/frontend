import React, { useState } from "react";
import CrearEtiquetas from "../components/CrearEtiquetas";
import BuscarEtiquetas from "../components/BuscarEtiquetas";
import EliminarEtiquetas from "../components/EliminarEtiquetas";
import ActualizarEtiquetas from "../components/ActualizarEtiquetas";

const Etiquetas = () => {
    const [moduloActivo, setModuloActivo] = useState(null);

    return (
        <div className="admin-container">
            <h1 className="admin-title">Gestión de Etiquetas</h1>
            <div className="admin-buttons-container">
                <button className="admin-button button-crear" onClick={() => setModuloActivo("crear")}>Crear Etiqueta</button>
                <button className="admin-button button-editar" onClick={() => setModuloActivo("editar")}>Actualizar Etiqueta</button>

            </div>

            <div className="admin-module-container" style={{ marginTop: "20px" }}>
                {moduloActivo === "crear" && <CrearEtiquetas />}
                {moduloActivo === "editar" && <ActualizarEtiquetas />} 
            </div>
        </div>
    );
};

export default Etiquetas;