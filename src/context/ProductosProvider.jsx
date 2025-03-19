import axios from "axios";
import { createContext, useEffect, useState } from "react";

const DisfracesContext = createContext();

const DisfracesProvider = ({ children }) => {
    const [disfraces, setDisfraces] = useState([]);

    // ✅ Listar todos los disfraces
    const listarDisfraces = async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/disfraz/listar`;
            const respuesta = await axios.get(url);
            setDisfraces(respuesta.data);
        } catch (error) {
            console.error("❌ Error al listar los disfraces:", error);
            setTimeout(() => listarDisfraces(), 5000); // Reintentar tras 5 segundos
        }
    };

    // ✅ Obtener detalle de un disfraz específico
    const obtenerDetalleDisfraz = async (id) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/disfraz/detalle/${id}`;
            const respuesta = await axios.get(url);
            return respuesta.data;
        } catch (error) {
            console.error("❌ Error al obtener detalle del disfraz:", error);
            throw error;  // Importante para capturarlo en el componente
        }
    };

    // ✅ Registrar nuevo disfraz
    const registrarDisfraz = async (formData) => {
        try {
            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_BACKEND_URL}/disfraz/registro`;
            const options = {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            };
            const respuesta = await axios.post(url, formData, options);
            return respuesta.data;
        } catch (error) {
            console.error("❌ Error al registrar disfraz:", error);
            throw error;
        }
    };

    // ✅ Actualizar un disfraz existente
    const actualizarDisfraz = async (id, formData) => {
        try {
            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_BACKEND_URL}/disfraz/actualizar/${id}`;
            const options = {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            };
            const respuesta = await axios.put(url, formData, options);
            return respuesta.data;
        } catch (error) {
            console.error("❌ Error al actualizar el disfraz:", error);
            throw error;
        }
    };

    // ✅ Eliminar un disfraz
    const eliminarDisfraz = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_BACKEND_URL}/disfraz/eliminar/${id}`;
            const options = {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            };
            const respuesta = await axios.delete(url, options);
            return respuesta.data;
        } catch (error) {
            console.error("❌ Error al eliminar el disfraz:", error);
            throw error;
        }
    };

    // ✅ Filtrar disfraces por categoría
    const filtrarDisfracesPorCategoria = (categoria) => {
        return disfraces.filter((disfraz) => disfraz.categoria === categoria);
    };

    // ✅ Cargar disfraces al inicio
    useEffect(() => {
        listarDisfraces();
    }, []);

    return (
        <DisfracesContext.Provider
            value={{
                disfraces,
                setDisfraces,
                listarDisfraces,
                obtenerDetalleDisfraz,
                registrarDisfraz,
                actualizarDisfraz,
                eliminarDisfraz,
                filtrarDisfracesPorCategoria,
            }}
        >
            {children}
        </DisfracesContext.Provider>
    );
};

export { DisfracesProvider };
export default DisfracesContext;