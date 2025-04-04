import React, { useState } from "react";

const CrearEventos = () => {
    const [formData, setFormData] = useState({
        mes: "",
        dia: "",
        nombre: "",
        descripcion: ""
    });

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
            
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/crear`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}` 
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Error al crear el evento");
            }

            const data = await response.json();
           
            alert("Evento creado exitosamente");
        } catch (error) {
            alert("Hubo un problema al crear el evento");
        }
    };

    return (
        <div className="form-container">
            <h2 className="tittle-crearev">Crear Eventos</h2>
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
                <button type="submit" className="form-button">Crear</button>
            </form>
        </div>
    );
};

export default CrearEventos;