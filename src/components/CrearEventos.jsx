import React, { useState, useEffect } from "react";

const CrearEventos = () => {
    const mesesDelAnio = [
        "Enero", "Febrero", "Marzo", "Abril",
        "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const [formData, setFormData] = useState({
        mes: "",
        dia: "",
        nombre: "",
        descripcion: ""
    });

    const [diasDisponibles, setDiasDisponibles] = useState([]);

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
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/crear`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    ...formData,
                    dia: parseInt(formData.dia, 10) // Convertir a número base 10
                })
            });

            if (!response.ok) throw new Error("Error al crear el evento");
            await response.json();
            alert("✅ Evento creado exitosamente");
        } catch (error) {
            alert("❌ Hubo un problema al crear el evento");
        }
    };

    return (
        <div className="form-container">
            <h2 className="tittle-crearev">Crear Eventos</h2>
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

                <button type="submit" className="form-button">Crear</button>
            </form>
        </div>
    );
};

export default CrearEventos;
