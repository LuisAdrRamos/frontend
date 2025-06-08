import React, { useState } from "react";
import CrearDisfraz from "../components/CrearDisfraz";
import ActualizarDisfraz from "../components/ActualizarDisfraz";

const Disfraces = () => {
    const [moduloActivo, setModuloActivo] = useState(null);

    return (
        <div className="admin-container">
            <h1 className="admin-title">Gestión de Disfraces</h1>
            <div className="admin-buttons-container">
                <button className="admin-button button-crear" onClick={() => setModuloActivo("crear")}>Crear Disfraz</button>
                <button className="admin-button button-actualizar" onClick={() => setModuloActivo("editar")}>Editar Disfraz</button>
            </div>

            <div className="admin-module-container" style={{ marginTop: "20px" }}>
                {moduloActivo === "crear" && <CrearDisfraz />}
                {moduloActivo === "editar" && <ActualizarDisfraz />}
            </div>
        </div>
    );
};

export default Disfraces;