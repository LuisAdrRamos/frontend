import React, { useState, useEffect } from "react";
import "../styles/c_ac_bsc_elim_admin.css";

const BuscarAdministradores = () => {
    const [emailBusqueda, setEmailBusqueda] = useState("");
    const [resultado, setResultado] = useState(null);
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

    const handleChange = (e) => {
        setEmailBusqueda(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const adminEncontrado = administradores.find(
            (admin) => admin.email.toLowerCase() === emailBusqueda.toLowerCase()
        );
        setResultado(adminEncontrado || null);
    };

    return (
        <div>
            <h2 className="title-eliminar">Buscar Administrador</h2>
            <form onSubmit={handleSearch} className="form-content">
                <div>
                    <label htmlFor="email">Correo Electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        value={emailBusqueda}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="form-button">Buscar</button>
            </form>

            {resultado ? (
                <div style={{ marginTop: "20px" }}>
                    <h3>Datos del Administrador</h3>
                    <p><strong>Nombre:</strong> {resultado.nombre}</p>
                    <p><strong>Apellido:</strong> {resultado.apellido}</p>
                    <p><strong>Dirección:</strong> {resultado.direccion}</p>
                    <p><strong>Teléfono:</strong> {resultado.telefono}</p>
                    <p><strong>Email:</strong> {resultado.email}</p>
                </div>
            ) : (
                emailBusqueda && <p style={{ marginTop: "20px" }}>No se encontró ningún administrador con ese correo.</p>
            )}
        </div>
    );
};

export default BuscarAdministradores;