import React, { useState } from "react";

const CrearEtiquetas = () => {
    const [formData, setFormData] = useState({
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
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/etiqueta/crear`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}` // Si es necesario
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Error al crear la etiqueta");
            }

            const data = await response.json();
            alert("✅ Etiqueta creada exitosamente");
            console.log("Etiqueta creada:", data);

            // Limpiar el formulario
            setFormData({
                nombre: "",
                descripcion: ""
            });
        } catch (error) {
            console.error("Error al crear la etiqueta:", error);
            alert("❌ Hubo un problema al crear la etiqueta");
        }
    };

    return (
        <div className="form-container">
            <h2 className="title-crear-etiquetas">Crear Etiqueta</h2>
            <form onSubmit={handleSubmit} className="form-content">
                <div className="form-group">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        className="form-input"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="descripcion">Descripción:</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        className="form-input"
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

export default CrearEtiquetas;