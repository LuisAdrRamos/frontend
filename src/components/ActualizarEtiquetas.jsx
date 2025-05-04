import React, { useState, useEffect } from "react";

const ActualizarEtiquetas = () => {
    const [etiquetas, setEtiquetas] = useState([]); // Lista de etiquetas
    const [filteredEtiquetas, setFilteredEtiquetas] = useState([]); // Lista filtrada por búsqueda
    const [selectedId, setSelectedId] = useState(""); // ID de la etiqueta seleccionada
    const [formData, setFormData] = useState({ nombre: "", descripcion: "" }); // Datos del formulario
    const [nombreBusqueda, setNombreBusqueda] = useState(""); // Nombre para buscar

    // Obtener la lista de etiquetas al montar el componente
    useEffect(() => {
        const fetchEtiquetas = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/etiqueta/listar`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}` // Si es necesario
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al obtener las etiquetas");
                }

                const data = await response.json();
                setEtiquetas(data); // Guardar la lista de etiquetas
                setFilteredEtiquetas(data); // Inicializar la lista filtrada
            } catch (error) {
                console.error("Error al cargar las etiquetas:", error);
                alert("Hubo un problema al cargar las etiquetas");
            }
        };

        fetchEtiquetas();
    }, []);

    // Filtrar etiquetas en tiempo real según el nombre ingresado
    useEffect(() => {
        if (nombreBusqueda.trim() === "") {
            setFilteredEtiquetas(etiquetas); // Mostrar todas si no hay búsqueda
        } else {
            const filtered = etiquetas.filter((etiqueta) =>
                etiqueta.nombre.toLowerCase().includes(nombreBusqueda.toLowerCase())
            );
            setFilteredEtiquetas(filtered);
        }
    }, [nombreBusqueda, etiquetas]);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Seleccionar una etiqueta para actualizar
    const handleSelect = (id) => {
        setSelectedId(id);
        const etiqueta = etiquetas.find((et) => et.id === parseInt(id));
        if (etiqueta) {
            setFormData({ nombre: etiqueta.nombre, descripcion: etiqueta.descripcion });
        }
    };

    // Actualizar una etiqueta
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/etiqueta/actualizar/${selectedId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}` // Si es necesario
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error("Error al actualizar la etiqueta");

            alert("✅ Etiqueta actualizada");
            // Actualizar la lista de etiquetas después de la actualización
            setEtiquetas((prev) =>
                prev.map((etiqueta) =>
                    etiqueta.id === selectedId ? { ...etiqueta, ...formData } : etiqueta
                )
            );
            setFilteredEtiquetas((prev) =>
                prev.map((etiqueta) =>
                    etiqueta.id === selectedId ? { ...etiqueta, ...formData } : etiqueta
                )
            );
            setSelectedId(""); // Limpiar la selección
        } catch (error) {
            console.error("❌ Error:", error);
            alert("❌ Hubo un error al actualizar");
        }
    };

    // Eliminar una etiqueta
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta etiqueta?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/etiqueta/eliminar/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}` // Si es necesario
                }
            });

            if (!response.ok) {
                throw new Error("Error al eliminar la etiqueta");
            }

            alert("Etiqueta eliminada exitosamente");
            // Actualizar la lista de etiquetas después de eliminar
            const updatedEtiquetas = etiquetas.filter((etiqueta) => etiqueta.id !== id);
            setEtiquetas(updatedEtiquetas);
            setFilteredEtiquetas(updatedEtiquetas); // Actualizar la lista filtrada
            setNombreBusqueda(""); // Limpiar el campo de búsqueda
        } catch (error) {
            console.error("Error al eliminar la etiqueta:", error);
            alert("Hubo un problema al eliminar la etiqueta");
        }
    };

    return (
        <div className="form-container">
            <h2>Actualizar Etiquetas</h2>

            {/* Buscador en tiempo real */}
            <div className="form-content">
                <label htmlFor="nombre">Buscar por Nombre:</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className="form-input"
                    value={nombreBusqueda}
                    onChange={(e) => setNombreBusqueda(e.target.value)}
                    placeholder="Ingrese un nombre"
                />
            </div>

            {/* Lista filtrada de etiquetas */}
            <ul className="etiquetas-list">
                {filteredEtiquetas.map((etiqueta) => (
                    <li key={etiqueta.id} className="etiqueta-item">
                        <strong>Nombre:</strong> {etiqueta.nombre} <br />
                        <strong>Descripción:</strong> {etiqueta.descripcion} <br />
                        <button
                            onClick={() => handleSelect(etiqueta.id)}
                            className="edit-button3"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => handleDelete(etiqueta.id)}
                            className="delete-button3"
                        >
                            Eliminar
                        </button>
                        <hr />
                    </li>
                ))}
            </ul>

            {/* Formulario de actualización */}
            {selectedId && (
                <form onSubmit={handleSubmit} className="form-content">
                    <h2>Actualizar Etiqueta</h2>
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
                    <button type="submit" className="form-button">Actualizar</button>
                </form>
            )}
        </div>
    );
};

export default ActualizarEtiquetas;