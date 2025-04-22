import axios from "axios";
import { createContext, useEffect, useState } from "react";

const EventosContext = createContext();

const EventosProvider = ({ children }) => {
    const [eventos, setEventos] = useState([]); // Lista de eventos

    // ✅ Listar todos los eventos
    const listarEventos = async () => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/festividad`; // URL corregida
            const respuesta = await axios.get(url);
            setEventos(respuesta.data);
        } catch (error) {
            console.error("❌ Error al listar los eventos:", error);
            setTimeout(() => listarEventos(), 5000); // Reintentar tras 5 segundos
        }
    };

    // ✅ Obtener detalle de un evento específico
    const obtenerDetalleEvento = async (id) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/festividad/detalle/${id}`; // URL corregida
            const respuesta = await axios.get(url);
            return respuesta.data; // Retorna el detalle del evento
        } catch (error) {
            console.error("❌ Error al obtener detalle del evento:", error);
            throw error; // Importante para capturarlo en el componente
        }
    };

    // ✅ Crear un nuevo evento
    const crearEvento = async (formData) => {
        try {
            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_BACKEND_URL}/festividad/crear`; // URL corregida
            const options = {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            };
            const respuesta = await axios.post(url, formData, options);
            return respuesta.data; // Retorna el evento creado
        } catch (error) {
            console.error("❌ Error al crear el evento:", error);
            throw error;
        }
    };

    // ✅ Actualizar un evento existente
    const actualizarEvento = async (id, formData) => {
        try {
            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_BACKEND_URL}/festividad/actualizar/${id}`; // URL corregida
            const options = {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            };
            const respuesta = await axios.put(url, formData, options);
            return respuesta.data; // Retorna el evento actualizado
        } catch (error) {
            console.error("❌ Error al actualizar el evento:", error);
            throw error;
        }
    };

    // ✅ Eliminar un evento
    const eliminarEvento = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const url = `${import.meta.env.VITE_BACKEND_URL}/festividad/eliminar/${id}`; // URL corregida
            const options = {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            };
            const respuesta = await axios.delete(url, options);
            return respuesta.data; // Retorna una confirmación de eliminación
        } catch (error) {
            console.error("❌ Error al eliminar el evento:", error);
            throw error;
        }
    };

    // ✅ Listar eventos por mes
    const listarEventosPorMes = async (mes) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL}/festividad/festividades-por-mes/${mes}`; // URL corregida
            const respuesta = await axios.get(url);
            return respuesta.data; // Retorna los eventos del mes específico
        } catch (error) {
            console.error("❌ Error al listar eventos por mes:", error);
            throw error;
        }
    };

    // ✅ Cargar eventos al inicio
    useEffect(() => {
        listarEventos(); // Cargar la lista inicial de eventos
    }, []);

    return (
        <EventosContext.Provider
            value={{
                eventos,
                listarEventos,
                obtenerDetalleEvento,
                crearEvento,
                actualizarEvento,
                eliminarEvento,
                listarEventosPorMes,
            }}
        >
            {children}
        </EventosContext.Provider>
    );
};

export { EventosProvider };
export default EventosContext;