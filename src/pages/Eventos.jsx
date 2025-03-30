import React, { useState } from "react";
import CrearEventos from "../components/CrearEventos";
import EditarEventos from "../components/EditarEventos";
import BuscarEvento from "../components/BuscarEvento";
import EliminarEvento from "../components/EliminarEvento";
import "../styles/Admin.css";

const eventosIniciales = [
    { mes: "Marzo", dia: "25", nombre: "Cumpleaños de Juan" },
    { mes: "Abril", dia: "10", nombre: "Día del Libro" }
];

const Eventos = () => {
    const [eventos, setEventos] = useState(eventosIniciales);
    const [moduloActivo, setModuloActivo] = useState(null);

    const handleActualizarEventos = (nuevosEventos) => {
        setEventos(nuevosEventos);
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">Gestión de Eventos</h1>
            <div className="admin-buttons-container">
                <button className="admin-button button-crear" onClick={() => setModuloActivo("crear")}>Crear Evento</button>
                <button className="admin-button button-actualizar" onClick={() => setModuloActivo("editar")}>Editar Evento</button>
                <button className="admin-button button-buscar" onClick={() => setModuloActivo("buscar")}>Buscar Evento</button>
                <button className="admin-button button-eliminar" onClick={() => setModuloActivo("eliminar")}>Eliminar Evento</button>
            </div>

            <div 
                className="admin-module-container"
                style={{ marginTop: "20px" }}>

                    {moduloActivo === "crear" && <CrearEventos />}
                    {moduloActivo === "editar" && <EditarEventos />}
                    {moduloActivo === "buscar" && <BuscarEvento eventos={eventos} />}
                    {moduloActivo === "eliminar" && (
                        <EliminarEvento
                            eventosIniciales={eventos}
                            onEliminar={handleActualizarEventos}
                        />
                )}
            </div>
        </div>
    );
};

export default Eventos;