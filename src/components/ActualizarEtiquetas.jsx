import React, { useState, useEffect } from "react";

const ActualizarEtiquetas = () => {
    const [etiquetas, setEtiquetas] = useState([]);
    const [filteredEtiquetas, setFilteredEtiquetas] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
    const [nombreBusqueda, setNombreBusqueda] = useState("");

    useEffect(() => {
        const fetchEtiquetas = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/etiqueta/listar`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const data = await response.json();
                setEtiquetas(data);
                setFilteredEtiquetas(data);
            } catch (error) {
                console.error("Error al cargar etiquetas:", error);
                alert("Error al cargar etiquetas");
            }
        };
        fetchEtiquetas();
    }, []);

    useEffect(() => {
        if (nombreBusqueda.trim() === "") {
            setFilteredEtiquetas(etiquetas);
        } else {
            const filtered = etiquetas.filter((etiqueta) =>
                etiqueta.nombre.toLowerCase().includes(nombreBusqueda.toLowerCase())
            );
            setFilteredEtiquetas(filtered);
        }
    }, [nombreBusqueda, etiquetas]);

    const handleSelect = (id) => {
        const etiqueta = etiquetas.find(et => et.id === id);
        if (etiqueta) {
            setSelectedId(id);
            setFormData({ nombre: etiqueta.nombre, descripcion: etiqueta.descripcion });
            setIsEditing(true);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/etiqueta/actualizar/${selectedId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error();

            alert("✅ Etiqueta actualizada");
            setEtiquetas(etiquetas.map(e => e.id === selectedId ? { ...e, ...formData } : e));
            setFilteredEtiquetas(filteredEtiquetas.map(e => e.id === selectedId ? { ...e, ...formData } : e));
            setIsEditing(false);
            setSelectedId("");
        } catch (error) {
            alert("❌ Error al actualizar etiqueta");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Eliminar esta etiqueta?")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/etiqueta/eliminar/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!res.ok) throw new Error();

            const updated = etiquetas.filter(et => et.id !== id);
            setEtiquetas(updated);
            setFilteredEtiquetas(updated);
        } catch (err) {
            alert("❌ Error al eliminar");
        }
    };

    return (
        <div className="form-container">
            <h2>Actualizar Etiquetas</h2>
            {!isEditing ? (
                <>
                    <div className="form-content">
                        <label>Buscar por Nombre:</label>
                        <input
                            type="text"
                            className="form-input"
                            value={nombreBusqueda}
                            onChange={(e) => setNombreBusqueda(e.target.value)}
                            placeholder="Ingrese un nombre"
                        />
                    </div>
                    <ul className="etiquetas-list">
                        {filteredEtiquetas.map(et => (
                            <li key={et.id}>
                                <strong>Nombre:</strong> {et.nombre} <br />
                                <strong>Descripción:</strong> {et.descripcion}
                                <br />
                                <button onClick={() => handleSelect(et.id)} className="edit-button3">Editar</button>
                                <button onClick={() => handleDelete(et.id)} className="delete-button3">Eliminar</button>
                                <hr />
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="form-content">
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-input" required />
                    <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-input" required />
                    <button type="submit" className="form-button">Guardar Cambios</button>
                    <button type="button" className="cancel-button" onClick={() => { setIsEditing(false); setSelectedId(""); }}>Cancelar</button>
                </form>
            )}
        </div>
    );
};

export default ActualizarEtiquetas;
