import React, { useState } from "react";

const EditarEventos = () => {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Evento creado:", formData);
    
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="mes">Mes:</label>
                <input
                    type="text"
                    id="mes"
                    name="mes"
                    value={formData.mes}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="dia">Día:</label>
                <input
                    type="number"
                    id="dia"
                    name="dia"
                    value={formData.dia}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="nombre">Nombre del evento o festividad:</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="descripcion">Descripción de la festividad:</label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Actualizar Evento</button>
        </form>
    );
};

export default EditarEventos;