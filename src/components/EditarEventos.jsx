import React, { useState, useEffect } from "react";

const EditarEventos = () => {
    const mesesDelAnio = [
        "Enero", "Febrero", "Marzo", "Abril",
        "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const [eventos, setEventos] = useState([]); // Lista de eventos
    const [formData, setFormData] = useState({
        mes: "",
        dia: "",
        nombre: "",
        descripcion: ""
    });
    const [diasDisponibles, setDiasDisponibles] = useState([]); // Días disponibles según el mes
    const [isEditing, setIsEditing] = useState(false); // Estado para saber si se está editando
    const [selectedId, setSelectedId] = useState(null); // ID del evento seleccionado

    // Obtener la lista de eventos al montar el componente
    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/festividades`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}` // Si es necesario
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al obtener las festividades");
                }

                const data = await response.json();
                setEventos(data); // Guardar la lista de eventos
            } catch (error) {
                console.error("Error al cargar las festividades:", error);
                alert("Hubo un problema al cargar las festividades");
            }
        };

        fetchEventos();
    }, []);

    // Función para determinar cuántos días tiene el mes seleccionado
    const obtenerDiasDelMes = (mes) => {
        const mesesCon30 = ["Abril", "Junio", "Septiembre", "Noviembre"];
        if (mes === "Febrero") return Array.from({ length: 29 }, (_, i) => i + 1); // Incluye 29 por si acaso
        return mesesCon30.includes(mes)
            ? Array.from({ length: 30 }, (_, i) => i + 1)
            : Array.from({ length: 31 }, (_, i) => i + 1);
    };

    // Actualizar días disponibles cuando cambia el mes
    useEffect(() => {
        if (formData.mes) {
            setDiasDisponibles(obtenerDiasDelMes(formData.mes));
            setFormData(prev => ({ ...prev, dia: "" })); // Limpiar día si se cambia el mes
        }
    }, [formData.mes]);

    const handleEdit = (id) => {
        const evento = eventos.find((evento) => evento.id === id);
        if (evento) {
            setFormData(evento); // Rellenar el formulario con los datos del evento
            setSelectedId(id); // Guardar el ID del evento seleccionado
            setIsEditing(true); // Cambiar a modo edición
        }
    };

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
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/actualizar/${selectedId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}` // Si es necesario
                },
                body: JSON.stringify({
                    ...formData,
                    dia: parseInt(formData.dia, 10) // Convertir a número base 10
                })
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el evento");
            }

            const data = await response.json();
            alert("✅ Evento actualizado exitosamente");
            console.log("Evento actualizado:", data);
            setIsEditing(false); // Salir del modo edición
        } catch (error) {
            console.error("Error al actualizar el evento:", error);
            alert("❌ Hubo un problema al actualizar el evento");
        }
    };

    return (
        <div className="form-container">
            {!isEditing ? (
                <>
                    <h2 className="tittle-editarev">Lista de Festividades</h2>
                    <ul className="event-list">
                        {eventos.map((evento) => (
                            <li key={evento.id} className="event-item">
                                {evento.nombre} - {evento.mes}/{evento.dia}
                                <button
                                    onClick={() => handleEdit(evento.id)}
                                    className="edit-button"
                                >
                                    Actualizar
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <>
                    <h2 className="tittle-editarev">Editar Evento</h2>
                    <form onSubmit={handleSubmit} className="form-content">

                        {/* MES */}
                        <div className="form-group1">
                            <label htmlFor="mes">Mes:</label>
                            <select
                                id="mes"
                                name="mes"
                                className="form-input3"
                                value={formData.mes}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Selecciona un mes --</option>
                                {mesesDelAnio.map((mes, index) => (
                                    <option key={index} value={mes}>{mes}</option>
                                ))}
                            </select>
                        </div>

                        {/* DÍA */}
                        <div className="form-group1">
                            <label htmlFor="dia">Día:</label>
                            <select
                                id="dia"
                                name="dia"
                                className="form-input3"
                                value={formData.dia}
                                onChange={handleChange}
                                required
                                disabled={!formData.mes}
                            >
                                <option value="">-- Selecciona un día --</option>
                                {diasDisponibles.map(dia => (
                                    <option key={dia} value={dia.toString()}>{dia}</option>
                                ))}
                            </select>
                        </div>

                        {/* NOMBRE */}
                        <div className="form-group1">
                            <label htmlFor="nombre">Nombre del evento o festividad:</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                className="form-input3"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* DESCRIPCIÓN */}
                        <div className="form-group1">
                            <label htmlFor="descripcion">Descripción de la festividad:</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                className="form-input3"
                                value={formData.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="form-button">Guardar Cambios</button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="cancel-button"
                        >
                            Cancelar
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default EditarEventos;