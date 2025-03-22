import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Mensaje from '../components/MensajeLogin';
import '../styles/login.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: ""
    // celular: ""
  });

  const [mensaje, setMensaje] = useState({ respuesta: '', tipo: '' });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regexNombreApellido = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    // Validar que los campos no estén vacíos
    if (!form.nombre.trim() || !form.apellido.trim() || !form.email.trim() || !form.password.trim()) {
      setMensaje({ respuesta: "Todos los campos son obligatorios.", tipo: "error" });
      return;
    }

    // Validar que los nombres y apellidos solo contengan letras y espacios
    if (!regexNombreApellido.test(form.nombre) || !regexNombreApellido.test(form.apellido)) {
      setMensaje({ respuesta: "El nombre y apellido solo pueden contener letras y espacios.", tipo: "error" });
      return;
    }

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/usuario/registro`;
      const respuesta = await axios.post(url, form);

      if (respuesta && respuesta.data) {
        setMensaje({ respuesta: respuesta.data.msg, tipo: 'success' });
        setTimeout(() => {
          setMensaje({ respuesta: '', tipo: '' });
          navigate('/login');
        }, 3000);
        setForm({
          nombre: "",
          apellido: "",
          email: "",
          password: ""
          // celular: ""
        });
      } else {
        setMensaje({ respuesta: 'Algo salió mal', tipo: 'error' });
      }

    } catch (error) {
      const errorMsg = error.response && error.response.data ? error.response.data.msg : 'Error al registrar';
      setMensaje({ respuesta: errorMsg, tipo: 'error' });
    }
  };

  return (
    <div className='login-body'>
      <Link className="brand" to="/">
        <div className="brand-content">
          <img
            src="public/logo.png"
            alt="Logo Megadisfraz"
            className="header-logo-img"
          />
          <span className="brand-text">Megadisfraz</span>
        </div>
      </Link>
      <div className="login-wrapper">
        <h2 className="text-center mb-4">Registro</h2>
        <form id="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="apellido">Apellido:</label>
            <input
              type="text"
              className="form-control"
              id="apellido"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          {/* <div className="form-group">
            <label htmlFor="celular">Celular:</label>
            <input
              type="text"
              className="form-control"
              id="celular"
              name="celular"
              value={form.celular}
              onChange={handleChange}
            />
          </div> */}
          <button type="submit" className="btn btn-primary">Registrarse</button>
          <p className="text-center mt-3">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="login-link">Inicia Sesión</Link>
          </p>
        </form>
        {mensaje.respuesta && (
          <Mensaje tipo={mensaje.tipo}>
            {mensaje.respuesta}
          </Mensaje>
        )}

      </div>
    </div>
  );
};

export default Register;
