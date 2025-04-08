import React, { useState, useEffect } from "react";
import '../styles/c_ac_bsc_elim_admin.css';

const ActualizarAdministradores = () => {
    const [administradores, setAdministradores] = useState([]); // Lista de administradores
    const [selectedId, setSelectedId] = useState(null); // ID del administrador seleccionado
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        email: "",
        contraseña: ""
    });

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

    // Obtener los detalles de un administrador específico
    const fetchDetalleAdministrador = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/detalle-moderador/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}` // Si es necesario
                }
            });

            if (!response.ok) {
                throw new Error("Error al obtener los detalles del administrador");
            }

            const data = await response.json();
            setFormData(data); // Rellenar el formulario con los datos del administrador
            setSelectedId(id); // Guardar el ID del administrador seleccionado
        } catch (error) {
            console.error("Error al cargar los detalles del administrador:", error);
            alert("Hubo un problema al cargar los detalles del administrador");
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
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/actualizar-moderador/${selectedId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}` // Si es necesario
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el administrador");
            }

            const data = await response.json();
            alert("Administrador actualizado exitosamente");
            console.log("Administrador actualizado:", data);
        } catch (error) {
            console.error("Error al actualizar el administrador:", error);
            alert("Hubo un problema al actualizar el administrador");
        }
    };

    return (
        <div className="form-container">
            <h2>Lista de Administradores</h2>
            {administradores.length > 0 ? (
                <ul>
                    {administradores.map((admin) => (
                        <li key={admin.id}>
                            <strong>Nombre:</strong> {admin.nombre} {admin.apellido} <br />
                            <strong>Email:</strong> {admin.email} <br />
                            <button
                                onClick={() => fetchDetalleAdministrador(admin.id)}
                                className="edit-button"
                            >
                                Editar
                            </button>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay administradores disponibles.</p>
            )}

            {selectedId && (
                <form onSubmit={handleSubmit} className="form-content">
                    <h2>Actualizar Administrador</h2>
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
                        <label htmlFor="apellido">Apellido:</label>
                        <input
                            type="text"
                            id="apellido"
                            name="apellido"
                            className="form-input"
                            value={formData.apellido}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="direccion">Dirección:</label>
                        <input
                            type="text"
                            id="direccion"
                            name="direccion"
                            className="form-input"
                            value={formData.direccion}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono:</label>
                        <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            className="form-input"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="contraseña">Contraseña:</label>
                        <input
                            type="password"
                            id="contraseña"
                            name="contraseña"
                            className="form-input"
                            value={formData.contraseña}
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

export default ActualizarAdministradores;