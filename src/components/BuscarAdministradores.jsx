import React, { useState } from "react";

const BuscarAdministradores = ({ administradores }) => {
    const [emailBusqueda, setEmailBusqueda] = useState("");
    const [resultado, setResultado] = useState(null);

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
            <h2>Buscar Administrador</h2>
            <form onSubmit={handleSearch}>
                <div>
                    <label htmlFor="email">Correo Electrónico:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={emailBusqueda}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Buscar</button>
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