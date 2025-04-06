import React, { useState } from "react";
import '../styles/c_ac_bsc_elim_admin.css';

const CrearAdministradores = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        email: "",
        contraseña: "",
        tipo: "moderador", // valor por defecto
    });

    const [mensaje, setMensaje] = useState("");

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
            const response = await fetch("http://localhost:3000/api/admin/crear-moderador", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`, // Asegúrate de tener token guardado
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || "Error al crear administrador");

            setMensaje("✅ Administrador creado correctamente");
            setFormData({
                nombre: "",
                apellido: "",
                direccion: "",
                telefono: "",
                email: "",
                password: "",
                rol: "moderador"
            });
        } catch (error) {
            setMensaje(`❌ ${error.message}`);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="form-content">
                <h2>Crear Administrador</h2>

                {mensaje && <p className="mensaje">{mensaje}</p>}

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
                        type="text"
                        id="telefono"
                        name="telefono"
                        className="form-input"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Correo:</label>
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
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-input"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="tipo">Tipo de Administrador:</label>
                    <select
                        id="tipo"
                        name="tipo"
                        className="form-input"
                        value={formData.tipo}
                        onChange={handleChange}
                        required
                    >
                        <option value="moderador">Moderador</option>
                        <option value="general">General</option>
                    </select>
                </div>

                <button type="submit" className="form-button">Crear</button>
            </form>
        </div>
    );
};

export default CrearAdministradores;
