import React, { useState, useEffect } from "react";

const EliminarEventos = () => {
    const [eventos, setEventos] = useState([]); 

    
    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/festividades`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}` 
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al obtener las festividades");
                }

                const data = await response.json();
                setEventos(data); 
            } catch (error) {
                console.error("Error al cargar las festividades:", error);
                alert("Hubo un problema al cargar las festividades");
            }
        };

        fetchEventos();
    }, []);

    
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este evento?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/eliminar/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}` 
                }
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el evento");
            }

            alert("Evento eliminado exitosamente");
            
            setEventos(eventos.filter((evento) => evento.id !== id));
        } catch (error) {
            console.error("Error al eliminar el evento:", error);
            alert("Hubo un problema al eliminar el evento");
        }
    };

    return (
        <div className="form-container">
            <h2 className="tittle-eliminarev">Lista de Festividades</h2>
            <ul className="event-list">
                {eventos.map((evento) => (
                    <li key={evento.id} className="event-item">
                        {evento.nombre} - {evento.mes}/{evento.dia}
                        <button
                            onClick={() => handleDelete(evento.id)}
                            className="delete-button"
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EliminarEventos;