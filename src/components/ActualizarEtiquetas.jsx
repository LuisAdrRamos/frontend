import React, { useState, useEffect } from "react";

const ActualizarEtiquetas = () => {
    const [etiquetas, setEtiquetas] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [formData, setFormData] = useState({ nombre: "", descripcion: "" });

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/etiqueta/listar`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => res.json())
            .then(setEtiquetas)
            .catch(console.error);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelect = (e) => {
        const id = e.target.value;
        setSelectedId(id);
        const etiqueta = etiquetas.find(et => et.id === parseInt(id));
        if (etiqueta) {
            setFormData({ nombre: etiqueta.nombre, descripcion: etiqueta.descripcion });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/etiqueta/actualizar/${selectedId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error("Error al actualizar la etiqueta");

            alert("✅ Etiqueta actualizada");
        } catch (error) {
            console.error("❌ Error:", error);
            alert("❌ Hubo un error al actualizar");
        }
    };

    return (
        <div className="form-container">
            <h2>Actualizar Etiqueta</h2>
            <form onSubmit={handleSubmit} className="form-content">
                <select onChange={handleSelect} required>
                    <option value="">Selecciona una etiqueta</option>
                    {etiquetas.map(e => (
                        <option key={e.id} value={e.id}>{e.nombre}</option>
                    ))}
                </select>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required />
                <button type="submit">Actualizar</button>
            </form>
        </div>
    );
};

export default ActualizarEtiquetas;
