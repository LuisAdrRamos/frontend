import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Mensaje from '../components/MensajeLogin';
import "../styles/login.css"; // Archivo de estilos combinado

const Forgot = () => {
    const [mensaje, setMensaje] = useState({});
    const [mail, setMail] = useState({ email: "", tipoUsuario: "usuario" });

    const handleChange = (e) => {
        setMail({
            ...mail,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Determinar la URL en base al tipo de usuario seleccionado
            const url = mail.tipoUsuario === "admin"
                ? `${import.meta.env.VITE_BACKEND_URL}/admin/recuperar-password`
                : `${import.meta.env.VITE_BACKEND_URL}/usuario/recuperar-password`;

            const respuesta = await axios.post(url, { email: mail.email });
            setMensaje({ respuesta: respuesta.data.msg, tipo: 'success' }); // Corregido aquí
            setMail({ email: "", tipoUsuario: "usuario" });
        } catch (error) {
            setMensaje({ respuesta: error.response?.data?.msg || "Error al recuperar contraseña", tipo: 'error' }); // ✅ Corregido aquí
        }
    };

    return (
        <>
            <div className="login-body">
                <Link className="brand" to="/">
                    <div className="brand-content">
                        <img
                            src="/logo.png"
                            alt="Logo Megadisfraz"
                            className="header-logo-img"
                        />
                        <span className="brand-text">Megadisfraz</span>
                    </div>
                </Link>
                <div className="login-wrapper">
                    {mensaje.respuesta && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
                    <h1 className="text-center mb-4">¡Olvidaste tu contraseña!</h1>
                    <h3 className="text-center mb-4">No te preocupes, ingresa tu correo</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="login-form-group">
                            <label className="mb-2 block text-sm font-semibold">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="form-control"
                                name="email"
                                value={mail.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="login-form-group">
                            <label className="mb-2 block text-sm font-semibold">Tipo de Usuario</label>
                            <select
                                className="form-control"
                                name="tipoUsuario"
                                value={mail.tipoUsuario}
                                onChange={handleChange}
                            >
                                <option value="usuario">Usuario</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <button type="submit" className="btn btn-primary">Enviar Correo</button>
                        </div>
                    </form>
                    <div className="text-center mt-3">
                        <p>Si la recuerdas</p>
                        <Link to="/login" className="register-link">Login</Link>
                    </div>
                </div>
            </div>
            <div className="forgot-background"></div>
        </>
    );
};

export default Forgot;