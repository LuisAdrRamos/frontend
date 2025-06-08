import React, { useState, useEffect } from "react";
import "../styles/modal.css";

const EditarEventos = () => {
    const mesesDelAnio = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const [eventos, setEventos] = useState([]);
    const [filteredEventos, setFilteredEventos] = useState([]);
    const [formData, setFormData] = useState({ mes: "", dia: "", nombre: "", descripcion: "" });
    const [diasDisponibles, setDiasDisponibles] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/festividades`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const data = await response.json();
                setEventos(data);
                setFilteredEventos(data);
            } catch (error) {
                console.error("Error al cargar eventos:", error);
                alert("Error al cargar eventos");
            }
        };
        fetchEventos();
    }, []);

    useEffect(() => {
        if (busqueda.trim() === "") {
            setFilteredEventos(eventos);
        } else {
            const filtered = eventos.filter((evento) =>
                evento.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                evento.mes.toLowerCase().includes(busqueda.toLowerCase()) ||
                evento.dia.toString().includes(busqueda)
            );
            setFilteredEventos(filtered);
        }
    }, [busqueda, eventos]);

    useEffect(() => {
        if (formData.mes) {
            const dias = formData.mes === "Febrero"
                ? Array.from({ length: 29 }, (_, i) => i + 1)
                : ["Abril", "Junio", "Septiembre", "Noviembre"].includes(formData.mes)
                    ? Array.from({ length: 30 }, (_, i) => i + 1)
                    : Array.from({ length: 31 }, (_, i) => i + 1);
            setDiasDisponibles(dias);
            setFormData(prev => ({ ...prev, dia: "" }));
        }
    }, [formData.mes]);

    const handleEdit = (id) => {
        const evento = eventos.find(e => e.id === id);
        if (evento) {
            setFormData(evento);
            setSelectedId(id);
            setIsEditing(true);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Estás seguro de eliminar este evento?")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/eliminar/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            if (!res.ok) throw new Error();
            alert("✅ Evento eliminado");
            const updated = eventos.filter(ev => ev.id !== id);
            setEventos(updated);
            setFilteredEventos(updated);
        } catch (err) {
            alert("❌ Error al eliminar evento");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/actualizar/${selectedId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ ...formData, dia: parseInt(formData.dia, 10) })
            });

            if (!res.ok) throw new Error();

            alert("✅ Evento actualizado correctamente");
            const updated = eventos.map(ev => ev.id === selectedId ? { ...ev, ...formData } : ev);
            setEventos(updated);
            setFilteredEventos(updated);
            setIsEditing(false);
            setSelectedId(null);
        } catch (err) {
            alert("❌ Error al actualizar el evento");
        }
    };

    return (
        <div className="form-container">
            {!isEditing ? (
                <>
                    <h2 className="admin-title">Lista de Festividades</h2>
                    <div className="form-content">
                        <label htmlFor="busqueda">Buscar por Nombre, Mes o Día:</label>
                        <input
                            type="text"
                            id="busqueda"
                            name="busqueda"
                            className="form-input"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Ingrese un nombre, mes o día"
                        />
                    </div>
                    <ul className="disfraz-list">
                        {filteredEventos.map(ev => (
                            <li key={ev.id} className="disfraz-item">
                                <div className="disfraz-info">
                                    <strong>{ev.nombre}</strong> - {ev.mes}/{ev.dia}
                                    <br />
                                    <small>{ev.descripcion}</small>
                                </div>
                                <div className="disfraz-actions">
                                    <button className="edit-button2" onClick={() => handleEdit(ev.id)}>Actualizar</button>
                                    <button className="delete-button2" onClick={() => handleDelete(ev.id)}>Eliminar</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="form-content">
                    <h2 className="admin-title">Editar Festividad</h2>

                    <div className="form-group">
                        <label htmlFor="nombre">Nombre del evento:</label>
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
                        <label htmlFor="mes">Mes:</label>
                        <select
                            id="mes"
                            name="mes"
                            className="form-input"
                            value={formData.mes}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Selecciona un mes --</option>
                            {mesesDelAnio.map((mes, idx) => (
                                <option key={idx} value={mes}>{mes}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="dia">Día:</label>
                        <select
                            id="dia"
                            name="dia"
                            className="form-input"
                            value={formData.dia}
                            onChange={handleChange}
                            disabled={!formData.mes}
                            required
                        >
                            <option value="">-- Selecciona un día --</option>
                            {diasDisponibles.map(dia => (
                                <option key={dia} value={dia}>{dia}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción:</label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            className="form-input"
                            value={formData.descripcion}
                            onChange={handleChange}
                            required
                            maxLength={250}
                        />
                        <p className={formData.descripcion.length >= 250 ? "text-error" : ""}>
                            {formData.descripcion.length} / 250 caracteres
                        </p>
                    </div>

                    <button type="submit" className="form-button">Guardar Cambios</button>
                    <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Cancelar</button>
                </form>
            )}
        </div>
    );
};

export default EditarEventos;
