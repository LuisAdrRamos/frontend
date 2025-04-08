import React, { useState, useEffect } from "react";
import "../styles/c_ac_bsc_elim_admin.css";

const EliminarAdministradores = () => {
    const [administradores, setAdministradores] = useState([]); // Lista de administradores

    // Obtener la lista de administradores al montar el componente
    useEffect(() => {
        const fetchAdministradores = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/listar-moderadores`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}` // Si es necesario
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al obtener la lista de administradores");
                }

                const data = await response.json();
                setAdministradores(data); // Guardar la lista de administradores
            } catch (error) {
                console.error("Error al cargar los administradores:", error);
                alert("Hubo un problema al cargar los administradores");
            }
        };

        fetchAdministradores();
    }, []);

    // Eliminar un administrador por ID
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este administrador?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/eliminar-moderador/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}` // Si es necesario
                }
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el administrador");
            }

            alert("Administrador eliminado exitosamente");
            // Actualizar la lista de administradores después de eliminar
            setAdministradores(administradores.filter((admin) => admin.id !== id));
        } catch (error) {
            console.error("Error al eliminar el administrador:", error);
            alert("Hubo un problema al eliminar el administrador");
        }
    };

    return (
        <div className="form-container">
            <h2 className="title-eliminar">Lista de Administradores</h2>
            {administradores.length > 0 ? (
                <ul className="admin-list">
                    {administradores.map((admin) => (
                        <li key={admin.id} className="admin-item">
                            <strong>Nombre:</strong> {admin.nombre} {admin.apellido} <br />
                            <strong>Email:</strong> {admin.email} <br />
                            <button
                                onClick={() => handleDelete(admin.id)}
                                className="delete-button"
                            >
                                Eliminar
                            </button>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay administradores disponibles.</p>
            )}
        </div>
    );
};

export default EliminarAdministradores;