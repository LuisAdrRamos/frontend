import React, { useState, useEffect } from "react";
import "../styles/c_ac_bsc_elim_admin.css";
import "../styles/modal.css";

const EliminarDisfraces = () => {
    const [disfraces, setDisfraces] = useState([]);

    
    useEffect(() => {
        const fetchDisfraces = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/listar`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}` 
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al obtener la lista de disfraces");
                }

                const data = await response.json();
                setDisfraces(data); 
            } catch (error) {
                console.error("Error al cargar los disfraces:", error);
                alert("Hubo un problema al cargar los disfraces");
            }
        };

        fetchDisfraces();
    }, []);

    // Eliminar un disfraz por ID
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este disfraz?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/eliminar/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}` 
                }
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el disfraz");
            }

            alert("Disfraz eliminado exitosamente");
            
            setDisfraces(disfraces.filter((disfraz) => disfraz.id !== id));
        } catch (error) {
            console.error("Error al eliminar el disfraz:", error);
            alert("Hubo un problema al eliminar el disfraz");
        }
    };

    return (
        <div className="form-container">
            <h2 className="title-eliminar-disfraces">Lista de Disfraces</h2>
            {disfraces.length > 0 ? (
                <ul className="disfraces-list">
                    {disfraces.map((disfraz) => (
                        <li key={disfraz.id} className="disfraz-item">
                            <strong>Nombre:</strong> {disfraz.nombre} <br />
                            <strong>Precio:</strong> ${disfraz.precio} <br />
                            <button
                                onClick={() => handleDelete(disfraz.id)}
                                className="delete-button"
                            >
                                Eliminar
                            </button>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay disfraces disponibles.</p>
            )}
        </div>
    );
};

export default EliminarDisfraces;