import React, { useState, useEffect } from "react";

const EliminarEtiquetas = () => {
    const [etiquetas, setEtiquetas] = useState([]); // Lista de etiquetas

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
            } catch (error) {
                console.error("Error al cargar las etiquetas:", error);
                alert("Hubo un problema al cargar las etiquetas");
            }
        };

        fetchEtiquetas();
    }, []);

    // Eliminar una etiqueta por ID
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
            setEtiquetas(etiquetas.filter((etiqueta) => etiqueta.id !== id));
        } catch (error) {
            console.error("Error al eliminar la etiqueta:", error);
            alert("Hubo un problema al eliminar la etiqueta");
        }
    };

    return (
        <div className="form-container">
            <h2 className="title-eliminar-etiquetas">Lista de Etiquetas</h2>
            {etiquetas.length > 0 ? (
                <ul className="etiquetas-list">
                    {etiquetas.map((etiqueta) => (
                        <li key={etiqueta.id} className="etiqueta-item">
                            <strong>Nombre:</strong> {etiqueta.nombre} <br />
                            <strong>Descripción:</strong> {etiqueta.descripcion} <br />
                            <button
                                onClick={() => handleDelete(etiqueta.id)}
                                className="delete-button"
                            >
                                Eliminar
                            </button>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay etiquetas disponibles.</p>
            )}
        </div>
    );
};

export default EliminarEtiquetas;