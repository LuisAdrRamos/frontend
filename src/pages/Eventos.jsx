import React, { useState } from "react";
import CrearEventos from "../components/CrearEventos";
import EditarEventos from "../components/EditarEventos";
import BuscarEvento from "../components/BuscarEvento";
import EliminarEvento from "../components/EliminarEvento";

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
        <div>
            <h1>Gestión de Eventos</h1>
            <div>
                <button onClick={() => setModuloActivo("crear")}>Crear Evento</button>
                <button onClick={() => setModuloActivo("editar")}>Editar Evento</button>
                <button onClick={() => setModuloActivo("buscar")}>Buscar Evento</button>
                <button onClick={() => setModuloActivo("eliminar")}>Eliminar Evento</button>
            </div>

            <div style={{ marginTop: "20px" }}>
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