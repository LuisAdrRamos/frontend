import React, { useState, useEffect } from "react";

const EditarEventos = () => {
    const [eventos, setEventos] = useState([]); 
    const [formData, setFormData] = useState({
        mes: "",
        dia: "",
        nombre: "",
        descripcion: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState(null); 


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

    
    const handleEdit = (id) => {
        const evento = eventos.find((evento) => evento.id === id);
        if (evento) {
            setFormData(evento); 
            setSelectedId(id); 
            setIsEditing(true); 
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/actualizar/${selectedId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}` 
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el evento");
            }

            const data = await response.json();
            alert("Evento actualizado exitosamente");
            console.log("Evento actualizado:", data);
            setIsEditing(false);
        } catch (error) {
            console.error("Error al actualizar el evento:", error);
            alert("Hubo un problema al actualizar el evento");
        }
    };

    return (
        <div className="form-container">
            {!isEditing ? (
                <>
                    <h2 className="tittle-editarev">Lista de Festividades</h2>
                    <ul className="event-list">
                        {eventos.map((evento) => (
                            <li key={evento.id} className="event-item">
                                {evento.nombre} - {evento.mes}/{evento.dia}
                                <button
                                    onClick={() => handleEdit(evento.id)}
                                    className="edit-button"
                                >
                                    Actualizar
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <>
                    <h2 className="tittle-editarev">Editar Evento</h2>
                    <form onSubmit={handleSubmit} className="form-content">
                        <div className="form-group1">
                            <label htmlFor="mes">Mes:</label>
                            <input
                                type="text"
                                id="mes"
                                name="mes"
                                className="form-input3"
                                value={formData.mes}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group1">
                            <label htmlFor="dia">Día:</label>
                            <input
                                type="number"
                                id="dia"
                                name="dia"
                                className="form-input3"
                                value={formData.dia}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group1">
                            <label htmlFor="nombre">Nombre del evento o festividad:</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                className="form-input3"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group1">
                            <label htmlFor="descripcion">Descripción de la festividad:</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                className="form-input3"
                                value={formData.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="form-button">Guardar Cambios</button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="cancel-button"
                        >
                            Cancelar
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default EditarEventos;