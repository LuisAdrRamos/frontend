import React, { useState } from "react";
import '../styles/c_ac_bsc_elim_admin.css';

const CrearAdministradores = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        email: "",
        contraseña: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Administrador creado:", formData);
        // Aquí puedes manejar el envío del formulario, como enviarlo a una API
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="form-content">
                <h2>Crear Administrador</h2>
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
                <button type="submit" className="form-button">Crear</button>
            </form>
        </div>
    );
};

export default CrearAdministradores;
