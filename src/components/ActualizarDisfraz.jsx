import React, { useState, useEffect } from "react";

const ActualizarDisfraz = () => {
    const [disfraces, setDisfraces] = useState([]); // Lista de disfraces
    const [filteredDisfraces, setFilteredDisfraces] = useState([]); // Lista filtrada por búsqueda
    const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([]); // Lista de etiquetas disponibles
    const [eventos, setEventos] = useState([]); // Lista de festividades
    const [formData, setFormData] = useState({
        nombre: "",
        festividad: "",
        descripcion: "",
        etiquetas: [],
        imagenes: [],
        imagen: null
    });
    const [selectedId, setSelectedId] = useState(null); // ID del disfraz seleccionado
    const [busqueda, setBusqueda] = useState(""); // Campo de búsqueda

    // Obtener la lista de disfraces, etiquetas y festividades al montar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [res1, res2, res3] = await Promise.all([
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/listar`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }}),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/etiqueta/listar`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }}),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/festividades`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }})
                ]);
                const [disf, etq, evt] = await Promise.all([res1.json(), res2.json(), res3.json()]);
                setDisfraces(disf);
                setFilteredDisfraces(disf); // Inicializar la lista filtrada
                setEtiquetasDisponibles(etq);
                setEventos(evt);
            } catch (error) {
                console.error("❌ Error al cargar datos:", error);
                alert("Hubo un problema al cargar la información inicial.");
            }
        };
        fetchData();
    }, []);

    // Filtrar disfraces en tiempo real según el nombre, etiquetas o festividad
    useEffect(() => {
        if (busqueda.trim() === "") {
            setFilteredDisfraces(disfraces); // Mostrar todos si no hay búsqueda
        } else {
            const filtered = disfraces.filter((disfraz) =>
                disfraz.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                disfraz.etiquetas?.some((etiqueta) =>
                    etiqueta.nombre.toLowerCase().includes(busqueda.toLowerCase())
                ) ||
                disfraz.festividad?.nombre.toLowerCase().includes(busqueda.toLowerCase())
            );
            setFilteredDisfraces(filtered);
        }
    }, [busqueda, disfraces]);

    const fetchDetalleDisfraz = async (id) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/detalle/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await res.json();
            setFormData({
                nombre: data.nombre,
                descripcion: data.descripcion,
                festividad: data.festividad?.id || "",
                etiquetas: data.etiquetas?.map(et => et.id) || [],
                imagenes: data.imagenes || [],
                imagen: null
            });
            setSelectedId(id);
        } catch (error) {
            alert("Error al cargar detalles del disfraz");
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este disfraz?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/eliminar/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el disfraz");
            }

            alert("Disfraz eliminado exitosamente");
            // Actualizar la lista de disfraces después de eliminar
            const updatedDisfraces = disfraces.filter((disfraz) => disfraz.id !== id);
            setDisfraces(updatedDisfraces);
            setFilteredDisfraces(updatedDisfraces); // Actualizar la lista filtrada
            setBusqueda(""); // Limpiar el campo de búsqueda
        } catch (error) {
            console.error("Error al eliminar el disfraz:", error);
            alert("Hubo un problema al eliminar el disfraz");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEtiquetaChange = (e) => {
        const id = parseInt(e.target.value);
        if (id === -1) {
            window.location.href = "/crear-etiqueta";
        } else if (!formData.etiquetas.includes(id) && formData.etiquetas.length < 5) {
            setFormData({ ...formData, etiquetas: [...formData.etiquetas, id] });
        }
    };

    const handleRemoveEtiqueta = (id) => {
        setFormData({ ...formData, etiquetas: formData.etiquetas.filter((e) => e !== id) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            festividadId: formData.festividad,
            etiquetas: formData.etiquetas,
            imagenes: formData.imagenes
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/actualizar/${selectedId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(dataToSend)
            });
            const result = await res.json();
            alert("✅ Disfraz actualizado exitosamente");
        } catch (error) {
            alert("❌ Error al actualizar disfraz");
        }
    };

    return (
        <div className="form-container">
            <h2>Lista de Disfraces</h2>

            {/* Buscador en tiempo real */}
            <div className="form-content">
                <label htmlFor="busqueda">Buscar por Nombre, Etiqueta o Festividad:</label>
                <input
                    type="text"
                    id="busqueda"
                    name="busqueda"
                    className="form-input"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Ingrese un nombre, etiqueta o festividad"
                />
            </div>

            {/* Lista filtrada de disfraces */}
            <ul className="disfraz-list">
                {filteredDisfraces.map((disfraz) => (
                    <li key={disfraz.id} className="disfraz-item">
                        <strong>Nombre:</strong> {disfraz.nombre} <br />
                        <strong>Etiquetas:</strong> {disfraz.etiquetas?.map(e => e.nombre).join(", ") || "Sin etiquetas"}<br />
                        <strong>Festividad:</strong> {disfraz.festividad?.nombre || "Sin festividad"}<br />
                        <button
                            onClick={() => fetchDetalleDisfraz(disfraz.id)}
                            className="edit-button"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => handleDelete(disfraz.id)}
                            className="delete-button"
                        >
                            Eliminar
                        </button>
                        <hr />
                    </li>
                ))}
            </ul>

            {/* Formulario de actualización */}
            {selectedId && (
                <form onSubmit={handleSubmit} className="form-content">
                    <h2>Editar Disfraz</h2>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
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
                        <label htmlFor="etiquetas">Etiquetas (máx. 5):</label>
                        <select className="form-input1" onChange={handleEtiquetaChange}>
                            <option value="">Seleccione una etiqueta</option>
                            {etiquetasDisponibles.map((e) => (
                                <option key={e.id} value={e.id}>{e.nombre}</option>
                            ))}
                            <option value="-1">➕ Crear nueva etiqueta</option>
                        </select>
                        <ul className="etiquetas-list">
                            {formData.etiquetas.map((id) => {
                                const etiqueta = etiquetasDisponibles.find(e => e.id === id);
                                return (
                                    <li key={id}>
                                        {etiqueta?.nombre || "Etiqueta desconocida"}{" "}
                                        <button type="button" onClick={() => handleRemoveEtiqueta(id)} className="remove-button">X</button>
                                    </li>
                                );
                            })}
                        </ul>
                        <p>{formData.etiquetas.length} / 5 etiquetas seleccionadas</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="festividad">Festividad:</label>
                        <select
                            className="form-input1"
                            name="festividad"
                            value={formData.festividad}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione una festividad</option>
                            {eventos.map(ev => (
                                <option key={ev.id} value={ev.id}>
                                    {ev.nombre} - {ev.mes}/{ev.dia}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción:</label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            className="form-input1"
                            value={formData.descripcion}
                            onChange={handleChange}
                            maxLength={250}
                            required
                        />
                        <p>{formData.descripcion.length} / 250 caracteres</p>
                    </div>

                    <button type="submit" className="form-button">Guardar Cambios</button>
                </form>
            )}
        </div>
    );
};

export default ActualizarDisfraz;