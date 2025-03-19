import axios from "axios";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  // Función para obtener el perfil del usuario o admin
  const obtenerPerfil = async (token) => {
    try {
      const urlBase = import.meta.env.VITE_BACKEND_URL;
      const tipoUsuario = localStorage.getItem("tipoUsuario");
      if (!tipoUsuario) throw new Error("Tipo de usuario no definido");

      const url = tipoUsuario === "admin"
        ? `${urlBase}/admin/perfil`
        : `${urlBase}/usuario/perfil/${auth.usuario?._id}`;

      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const respuesta = await axios.get(url, options);
      setAuth({
        usuario: respuesta.data,
        rol: tipoUsuario,
      });

      return respuesta.data;
    } catch (error) {
      console.error("❌ Error al obtener el perfil:", error);
      throw error;
    }
  };

  // 🔹 Función para actualizar el perfil (Admin o Usuario)
  const actualizarPerfil = async (id, datos) => {
    try {
      const token = localStorage.getItem("token");
      const tipoUsuario = localStorage.getItem("tipoUsuario");
      const url = tipoUsuario === "admin"
        ? `${import.meta.env.VITE_BACKEND_URL}/admin/actualizar/${id}`
        : `${import.meta.env.VITE_BACKEND_URL}/usuario/actualizar/${id}`;

      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const respuesta = await axios.put(url, datos, options);
      setAuth(respuesta.data);
      return respuesta.data;
    } catch (error) {
      console.error("❌ Error al actualizar el perfil:", error);
      throw error;
    }
  };

  // 🔹 Función para actualizar la contraseña (Admin o Usuario)
  const actualizarPassword = async (datos) => {
    try {
      const token = localStorage.getItem("token");
      const tipoUsuario = localStorage.getItem("tipoUsuario");
      const url = tipoUsuario === "admin"
        ? `${import.meta.env.VITE_BACKEND_URL}/admin/actualizar-password`
        : `${import.meta.env.VITE_BACKEND_URL}/usuario/actualizar-password`;

      const options = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const respuesta = await axios.put(url, datos, options);
      return respuesta.data;
    } catch (error) {
      console.error("❌ Error al actualizar la contraseña:", error);
      throw error;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      obtenerPerfil(token);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        obtenerPerfil,
        actualizarPerfil,
        actualizarPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export default AuthContext;