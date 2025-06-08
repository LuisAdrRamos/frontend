import React, { useState, useEffect } from "react";
import '../styles/modal.css';

const ActualizarDisfraz = () => {
    const [disfraces, setDisfraces] = useState([]);
    const [filteredDisfraces, setFilteredDisfraces] = useState([]);
    const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [formData, setFormData] = useState({
        nombre: "",
        festividades: [],
        descripcion: "",
        etiquetas: [],
        imagenes: []
    });
    const [selectedId, setSelectedId] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const ordenarFestividades = (festividades) => {
        const mesesOrden = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        return [...festividades].sort((a, b) => {
            const mesA = mesesOrden.indexOf(a.mes);
            const mesB = mesesOrden.indexOf(b.mes);
            if (mesA !== mesB) return mesA - mesB;
            return a.dia - b.dia;
        });
    };

    const ordenarEtiquetas = (etiquetas) => {
        return [...etiquetas].sort((a, b) => a.nombre.localeCompare(b.nombre));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [resDisfraces, resEtiquetas, resFestividades] = await Promise.all([
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/listar`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/etiqueta/listar`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/festividades`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
                ]);

                if (!resDisfraces.ok || !resEtiquetas.ok || !resFestividades.ok) {
                    throw new Error("Error al cargar datos iniciales");
                }

                const [disfracesData, etiquetasData, festividadesData] = await Promise.all([
                    resDisfraces.json(),
                    resEtiquetas.json(),
                    resFestividades.json()
                ]);

                setDisfraces(disfracesData);
                setFilteredDisfraces(disfracesData);
                setEtiquetasDisponibles(ordenarEtiquetas(etiquetasData || []));
                setEventos(ordenarFestividades(festividadesData || []));
                setLoading(false);
            } catch (error) {
                console.error("❌ Error al cargar datos:", error);
                setError("Hubo un problema al cargar la información inicial");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (busqueda.trim() === "") {
            setFilteredDisfraces(disfraces);
        } else {
            const filtered = disfraces.filter((disfraz) =>
                disfraz.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                disfraz.etiquetas?.some(etiqueta => etiqueta.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
                disfraz.festividades?.some(festividad => festividad.nombre.toLowerCase().includes(busqueda.toLowerCase()))
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

            const imagenesPreparadas = data.imagenes.map(img => ({ url: img, preview: img }));

            setFormData({
                nombre: data.nombre,
                descripcion: data.descripcion,
                festividades: data.festividades?.map(f => f.id) || [],
                etiquetas: data.etiquetas?.map(et => et.id) || [],
                imagenes: imagenesPreparadas
            });
            setSelectedId(id);
            setIsEditing(true);
        } catch (error) {
            console.error("Error al cargar detalles del disfraz:", error);
            alert("Error al cargar detalles del disfraz");
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este disfraz?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/eliminar/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            if (!response.ok) {
                throw new Error("Error al eliminar el disfraz");
            }

            alert("✅ Disfraz eliminado exitosamente");
            const updatedDisfraces = disfraces.filter((disfraz) => disfraz.id !== id);
            setDisfraces(updatedDisfraces);
            setFilteredDisfraces(updatedDisfraces);
            setSelectedId(null);
            setIsEditing(false);
        } catch (error) {
            console.error("❌ Error al eliminar el disfraz:", error);
            alert("❌ Hubo un problema al eliminar el disfraz");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEtiquetaChange = (e) => {
        const value = parseInt(e.target.value);
        if (value === -1) return alert("Redirigir a crear etiqueta");
        if (!formData.etiquetas.includes(value) && formData.etiquetas.length < 6) {
            setFormData({ ...formData, etiquetas: [...formData.etiquetas, value] });
        }
    };

    const handleRemoveEtiqueta = (id) => {
        setFormData({ ...formData, etiquetas: formData.etiquetas.filter(e => e !== id) });
    };

    const handleFestividadChange = (e) => {
        const value = parseInt(e.target.value);
        if (value === -1) return alert("Redirigir a crear festividad");
        if (!formData.festividades.includes(value) && formData.festividades.length < 5) {
            setFormData({ ...formData, festividades: [...formData.festividades, value] });
        }
    };

    const handleRemoveFestividad = (id) => {
        setFormData({ ...formData, festividades: formData.festividades.filter(f => f !== id) });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const nuevosArchivos = files.slice(0, 3 - formData.imagenes.length);

        const nuevasImagenes = nuevosArchivos.map(file => ({ file, preview: URL.createObjectURL(file) }));
        setFormData(prev => ({ ...prev, imagenes: [...prev.imagenes, ...nuevasImagenes] }));
    };

    const removePreview = (index) => {
        setFormData(prev => ({ ...prev, imagenes: prev.imagenes.filter((_, idx) => idx !== index) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        alert("Formulario enviado correctamente");
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="form-container">
                <div className="loading-spinner"></div>
                <p>Cargando datos necesarios...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="form-container">
                <p className="error-message">{error}</p>
                <button className="form-button" onClick={() => window.location.reload()}>Reintentar</button>
            </div>
        );
    }

    return (
        <div className="form-container">
            {!isEditing ? (
                <>
                    <h2 className="titlelistDis">Lista de Disfraces</h2>
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
                    <ul className="disfraz-list">
                        {filteredDisfraces.map((disfraz) => (
                            <li key={disfraz.id} className="disfraz-item">
                                <div className="disfraz-info">
                                    <strong>Nombre:</strong> {disfraz.nombre} <br />
                                    <strong>Etiquetas:</strong> {disfraz.etiquetas?.map(e => e.nombre).join(", ")}<br />
                                    <strong>Festividades:</strong> {disfraz.festividades?.map(f => f.nombre).join(", ")}<br />
                                </div>
                                <div className="disfraz-actions">
                                    <button onClick={() => fetchDetalleDisfraz(disfraz.id)} className="edit-button2">Editar</button>
                                    <button onClick={() => handleDelete(disfraz.id)} className="delete-button2">Eliminar</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
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
                            maxLength={100}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="etiquetas">Etiquetas (máx. 6):</label>
                        <select
                            id="etiquetas"
                            name="etiquetas"
                            className="form-input1"
                            onChange={handleEtiquetaChange}
                            value=""
                        >
                            <option value="">Seleccione una etiqueta</option>
                            {etiquetasDisponibles.map(et => (
                                <option key={et.id} value={et.id}>{et.nombre}</option>
                            ))}
                            <option value="-1">➕ Crear nueva etiqueta</option>
                        </select>
                        <ul className="etiquetas-list">
                            {formData.etiquetas.map(id => {
                                const etiqueta = etiquetasDisponibles.find(e => e.id === id);
                                return (
                                    <li key={id}>
                                        {etiqueta?.nombre || "Etiqueta desconocida"}
                                        <button
                                            type="button"
                                            className="remove-button"
                                            onClick={() => handleRemoveEtiqueta(id)}
                                        >
                                            X
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                        <p className={formData.etiquetas.length >= 6 ? "text-error" : ""}>
                            {formData.etiquetas.length} / 6 etiquetas seleccionadas
                        </p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="festividad">Festividades (máx. 5):</label>
                        <select
                            id="festividad"
                            name="festividad"
                            className="form-input1"
                            onChange={handleFestividadChange}
                            value=""
                        >
                            <option value="">Seleccione una festividad</option>
                            {eventos.map(ev => (
                                <option key={ev.id} value={ev.id}>
                                    {ev.nombre} - {ev.mes}/{ev.dia}
                                </option>
                            ))}
                            <option value="-1">➕ Crear nueva festividad</option>
                        </select>
                        <ul className="festividades-list">
                            {formData.festividades.map(id => {
                                const festividad = eventos.find(ev => ev.id === id);
                                return (
                                    <li key={id}>
                                        {festividad?.nombre || "Festividad desconocida"}
                                        <button
                                            type="button"
                                            className="remove-button"
                                            onClick={() => handleRemoveFestividad(id)}
                                        >
                                            X
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                        <p className={formData.festividades.length >= 5 ? "text-error" : ""}>
                            {formData.festividades.length} / 5 festividades seleccionadas
                        </p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción (máx. 250 caracteres):</label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            className="form-input1"
                            value={formData.descripcion}
                            onChange={handleChange}
                            maxLength={250}
                            required
                        />
                        <p className={formData.descripcion.length >= 250 ? "text-error" : ""}>
                            {formData.descripcion.length} / 250 caracteres
                            {formData.descripcion.length >= 250 && " (Límite alcanzado)"}
                        </p>
                    </div>

                    <div className="form-group">
                        <label>Imágenes (máximo 3):</label>
                        <div className="image-preview-container">
                            {formData.imagenes.map((img, idx) => (
                                <div key={idx} className="image-box">
                                    <img 
                                        src={img.preview || img.url} 
                                        alt={`Preview ${idx}`} 
                                        className="preview-img" 
                                    />
                                    <button
                                        type="button"
                                        className="remove-button"
                                        onClick={() => removePreview(idx)}
                                        aria-label="Eliminar imagen"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                            {formData.imagenes.length < 3 && (
                                <div className="image-box upload-box">
                                    <label className="add-image-label">
                                        +
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            hidden
                                            multiple
                                            aria-label="Añadir imagen"
                                        />
                                    </label>
                                    <p className="add-image-text">Añadir imagen</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="form-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Actualizando..." : "Guardar Cambios"}
                    </button>
                    <button 
                        type="button" 
                        className="cancel-button" 
                        onClick={() => {
                            setIsEditing(false);
                            setSelectedId(null);
                        }}
                    >Cancelar</button>
                </form>
            )}
        </div>
    );
};

export default ActualizarDisfraz;