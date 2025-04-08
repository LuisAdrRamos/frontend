import React, { useState } from "react";
import '../styles/c_ac_bsc_elim_admin.css';

const CrearAdministradores = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        email: "",
        password: "", // este nombre debe coincidir con lo que espera el backend
        rol: "moderador", // por defecto, no editable
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
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
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

                {["nombre", "apellido", "direccion", "telefono", "email", "password"].map((field) => (
                    <div className="form-group" key={field}>
                        <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                        <input
                            type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                            id={field}
                            name={field}
                            className="form-input"
                            value={formData[field]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}

                <button type="submit" className="form-button">Crear</button>
            </form>
        </div>
    );
};

export default CrearAdministradores;
