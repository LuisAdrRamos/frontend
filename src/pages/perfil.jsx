import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import "../styles/Perfil.css";

const Perfil = () => {
  const navigate = useNavigate();
  const { auth, obtenerPerfil, actualizarPerfil, actualizarPassword } = useContext(AuthContext);
  const [form, setForm] = useState({ passwordactual: "", password: "", confirmpassword: "" });
  const [mensaje, setMensaje] = useState("");
  const [updatedNombre, setUpdatedNombre] = useState("");
  const [updatedApellido, setUpdatedApellido] = useState("");
  const tipoUsuario = auth?.rol;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      obtenerPerfil(token)
        .then((data) => {
          setUpdatedNombre(data.nombre);
          setUpdatedApellido(data.apellido);
        })
        .catch(() => {
          setMensaje("Error al cargar el perfil.");
        });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tipoUsuario");
    navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!updatedNombre.trim() || !updatedApellido.trim()) {
      setMensaje("El nombre y apellido no pueden estar vacíos.");
      return;
    }

    // Validar que solo contengan letras y espacios
    if (!regex.test(updatedNombre) || !regex.test(updatedApellido)) {
      setMensaje("El nombre y apellido solo pueden contener letras y espacios.");
      return;
    }
    try {
      await actualizarPerfil(auth.usuario._id, {
        nombre: updatedNombre,
        apellido: updatedApellido,
      });
      setMensaje("Perfil actualizado con éxito.");
      setTimeout(() => {
        navigate("/perfil");
      }, 1000);
    } catch (error) {
      setMensaje("Error al actualizar el perfil.");
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (!form.passwordactual || !form.password || !form.confirmpassword) {
      setMensaje("Todos los campos de contraseña son obligatorios.");
      return;
    }
    if (form.password !== form.confirmpassword) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }
    try {
      await actualizarPassword({
        passwordactual: form.passwordactual,
        passwordnuevo: form.password,
      });
      setMensaje("Contraseña actualizada correctamente.");
      setForm({ passwordactual: "", password: "", confirmpassword: "" });
    } catch (error) {
      setMensaje("Error al actualizar la contraseña.");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <h4 className="mb-4 text-center">
          {tipoUsuario === "admin" ? "Perfil de Administrador" : "Perfil de Usuario"}
        </h4>

        {mensaje && (
          <div className={`alert ${mensaje.includes("Error") ? "alert-danger" : "alert-success"}`}>
            {mensaje}
          </div>
        )}

        {auth.usuario ? (
          <table className="profile-table">
            <thead>
              <tr>
                <th class="hidden-on-mobile">ID de Usuario</th>
                <th>Correo Electrónico</th>
                <th>Nombre</th>
                <th>Apellido</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="hidden-on-mobile">{auth.usuario._id}</td>
                <td>{auth.usuario.email}</td>
                <td>{auth.usuario.nombre}</td>
                <td>{auth.usuario.apellido}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>Cargando...</p>
        )}

        <form onSubmit={handleProfileUpdate}>
          <div className="mb-3">
            <label className="form-label">Nuevo Nombre</label>
            <input
              type="text"
              className="profile-input"
              value={updatedNombre}
              onChange={(e) => setUpdatedNombre(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Nuevo Apellido</label>
            <input
              type="text"
              className="profile-input"
              value={updatedApellido}
              onChange={(e) => setUpdatedApellido(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success profile-button">
            Actualizar Perfil
          </button>
        </form>

        <form onSubmit={handleSubmitPassword}>
          <div className="mb-3">
            <label className="form-label">Contraseña Actual</label>
            <input
              type="password"
              placeholder="Ingrese su contraseña actual"
              className="profile-input"
              name="passwordactual"
              value={form.passwordactual}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Nueva Contraseña</label>
            <input
              type="password"
              placeholder="Ingrese su nueva contraseña"
              className="profile-input"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirmar Contraseña</label>
            <input
              type="password"
              placeholder="Repita su nueva contraseña"
              className="profile-input"
              name="confirmpassword"
              value={form.confirmpassword}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary profile-button">
            Actualizar Contraseña
          </button>
        </form>

        <div className="d-flex justify-content-between mt-3">
          <button type="button" className="btn btn-danger profile-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;