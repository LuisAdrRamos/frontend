// src/pages/ActualizarDisfraz.jsx
import React, { useState, useEffect } from "react";
import "../styles/modal.css";
import { normalizeImages } from "../utils/imageUtils";

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
        imagenes: [],          // siempre array de { url, preview }
    });
    const [selectedId, setSelectedId] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const ordenarFestividades = list => {
        const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        return [...list].sort((a, b) => {
            const ia = meses.indexOf(a.mes), ib = meses.indexOf(b.mes);
            return ia !== ib ? ia - ib : a.dia - b.dia;
        });
    };

    const ordenarEtiquetas = list =>
        [...list].sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Carga inicial
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const [rD, rE, rF] = await Promise.all([
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/listar`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/etiqueta/listar`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/festividades`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                    })
                ]);
                if (!rD.ok || !rE.ok || !rF.ok) throw new Error();
                const [dd, ed, fd] = await Promise.all([rD.json(), rE.json(), rF.json()]);
                setDisfraces(dd);
                setFilteredDisfraces(dd);
                setEtiquetasDisponibles(ordenarEtiquetas(ed || []));
                setEventos(ordenarFestividades(fd || []));
            } catch (err) {
                console.error(err);
                setError("Error al cargar datos iniciales");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Filtrado dinámico
    useEffect(() => {
        if (!busqueda.trim()) {
            setFilteredDisfraces(disfraces);
        } else {
            const b = busqueda.toLowerCase();
            setFilteredDisfraces(
                disfraces.filter(d =>
                    d.nombre.toLowerCase().includes(b) ||
                    d.etiquetas?.some(et => et.nombre.toLowerCase().includes(b)) ||
                    d.festividades?.some(f => f.nombre.toLowerCase().includes(b))
                )
            );
        }
    }, [busqueda, disfraces]);

    // Cargar detalle para editar
    const fetchDetalleDisfraz = async id => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/disfraz/detalle/${id}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            if (!res.ok) throw new Error();
            const data = await res.json();

            const urls = normalizeImages(data.imagenes);
            const imgs = urls.map(u => ({ url: u, preview: u }));

            setFormData({
                nombre: data.nombre,
                descripcion: data.descripcion || "",
                festividades: data.festividades?.map(f => f.id) || [],
                etiquetas: data.etiquetas?.map(et => et.id) || [],
                imagenes: imgs
            });
            setSelectedId(id);
            setIsEditing(true);
        } catch {
            alert("Error al cargar detalles del disfraz");
        }
    };

    // Borrar disfraz
    const handleDelete = async id => {
        if (!confirm("¿Eliminar este disfraz?")) return;
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/disfraz/eliminar/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                }
            );
            if (!res.ok) throw new Error();
            alert("Disfraz eliminado");
            const upd = disfraces.filter(d => d.id !== id);
            setDisfraces(upd);
            setFilteredDisfraces(upd);
            setIsEditing(false);
            setSelectedId(null);
        } catch {
            alert("Error al eliminar");
        }
    };

    // Handlers de formulario
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(f => ({ ...f, [name]: value }));
    };

    const handleEtiquetaChange = e => {
        const v = +e.target.value;
        if (v === -1) {
            window.location.href = "/admin/etiquetas/crear";
            return;
        }
        setFormData(f =>
            f.etiquetas.includes(v) || f.etiquetas.length >= 6
                ? f
                : { ...f, etiquetas: [...f.etiquetas, v] }
        );
    };

    const handleRemoveEtiqueta = id =>
        setFormData(f => ({
            ...f,
            etiquetas: f.etiquetas.filter(x => x !== id)
        }));

    const handleFestividadChange = e => {
        const v = +e.target.value;
        if (v === -1) {
            window.location.href = "/admin/festividades/crear";
            return;
        }
        setFormData(f =>
            f.festividades.includes(v) || f.festividades.length >= 5
                ? f
                : { ...f, festividades: [...f.festividades, v] }
        );
    };

    const handleRemoveFestividad = id =>
        setFormData(f => ({
            ...f,
            festividades: f.festividades.filter(x => x !== id)
        }));

    const handleFileChange = e => {
        const files = Array.from(e.target.files).slice(0, 3 - formData.imagenes.length);
        const nuevos = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setFormData(f => ({ ...f, imagenes: [...f.imagenes, ...nuevos] }));
    };

    const removePreview = idx =>
        setFormData(f => ({
            ...f,
            imagenes: f.imagenes.filter((_, i) => i !== idx)
        }));

    const handleSubmit = async e => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append("nombre", formData.nombre);
            data.append("descripcion", formData.descripcion);
            data.append("festividades", JSON.stringify(formData.festividades));
            data.append("etiquetas", JSON.stringify(formData.etiquetas));
            data.append(
                "imagenesExistentes",
                JSON.stringify(formData.imagenes.map(i => i.url))
            );
            formData.imagenes
                .filter(i => i.file)
                .forEach(i => data.append("imagenesNuevas", i.file));

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/disfraz/actualizar/${selectedId}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: data
                }
            );
            if (!res.ok) throw new Error();
            alert("Disfraz actualizado");
            window.location.reload();
        } catch {
            alert("Error al actualizar");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="form-container">
                <div className="loading-spinner" />
                <p>Cargando datos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="form-container">
                <p className="error-message">{error}</p>
                <button className="form-button" onClick={() => window.location.reload()}>
                    Reintentar
                </button>
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
                            id="busqueda"
                            className="form-input"
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                            placeholder="Ingrese texto..."
                        />
                    </div>
                    <ul className="disfraz-list">
                        {filteredDisfraces.map(d => (
                            <li key={d.id} className="disfraz-item">
                                <div className="disfraz-info">
                                    <strong>Nombre:</strong> {d.nombre}<br />
                                    <strong>Etiquetas:</strong> {d.etiquetas?.map(et => et.nombre).join(", ")}<br />
                                    <strong>Festividades:</strong> {d.festividades?.map(f => f.nombre).join(", ")}
                                </div>
                                <div className="disfraz-actions">
                                    <button
                                        className="edit-button2"
                                        onClick={() => fetchDetalleDisfraz(d.id)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="delete-button2"
                                        onClick={() => handleDelete(d.id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="form-content">
                    <h2 className="titlelistDis">Editar Disfraz</h2>

                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input
                            id="nombre"
                            name="nombre"
                            className="form-input"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Descripción (máx. 250):</label>
                        <textarea
                            name="descripcion"
                            className="form-input1"
                            value={formData.descripcion}
                            onChange={handleChange}
                            maxLength={250}
                        />
                        <p className={formData.descripcion.length >= 250 ? "text-error" : ""}>
                            {formData.descripcion.length} / 250
                        </p>
                    </div>

                    <div className="form-group">
                        <label>Etiquetas (máx. 6):</label>
                        <select className="form-input1" onChange={handleEtiquetaChange}>
                            <option value="">Seleccione una etiqueta</option>
                            {etiquetasDisponibles.map(et => (
                                <option key={et.id} value={et.id}>{et.nombre}</option>
                            ))}
                            <option value={-1}>➕ Crear nueva</option>
                        </select>
                        <ul className="etiquetas-list">
                            {formData.etiquetas.map(id => {
                                const et = etiquetasDisponibles.find(x => x.id === id);
                                return (
                                    <li key={id}>
                                        {et?.nombre}
                                        <button type="button" className="remove-button" onClick={() => handleRemoveEtiqueta(id)}>
                                            ×
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                        <p className={formData.etiquetas.length >= 6 ? "text-error" : ""}>
                            {formData.etiquetas.length} / 6
                        </p>
                    </div>

                    <div className="form-group">
                        <label>Festividades (máx. 5):</label>
                        <select className="form-input1" onChange={handleFestividadChange}>
                            <option value="">Seleccione una festividad</option>
                            {eventos.map(ev => (
                                <option key={ev.id} value={ev.id}>{ev.nombre}</option>
                            ))}
                            <option value={-1}>➕ Crear nueva</option>
                        </select>
                        <ul className="festividades-list">
                            {formData.festividades.map(id => {
                                const f = eventos.find(x => x.id === id);
                                return (
                                    <li key={id}>
                                        {f?.nombre}
                                        <button type="button" className="remove-button" onClick={() => handleRemoveFestividad(id)}>
                                            ×
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                        <p className={formData.festividades.length >= 5 ? "text-error" : ""}>
                            {formData.festividades.length} / 5
                        </p>
                    </div>

                    <div className="form-group">
                        <label>Imágenes (máx. 3):</label>
                        <div className="image-preview-container">
                            {formData.imagenes.map((img, idx) => (
                                <div key={idx} className="image-box">
                                    <img src={img.preview || img.url} alt="" className="preview-img" />
                                    <button type="button" className="remove-button" onClick={() => removePreview(idx)}>
                                        ×
                                    </button>
                                </div>
                            ))}
                            {formData.imagenes.length < 3 && (
                                <label className="image-box upload-box">
                                    <span className="add-image-label">+</span>
                                    <span className="add-image-text">Añadir imagen</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        multiple
                                        onChange={handleFileChange}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="form-button" disabled={isSubmitting}>
                        {isSubmitting ? "Actualizando..." : "Guardar Cambios"}
                    </button>
                    <button type="button" className="cancel-button" onClick={() => { setIsEditing(false); setSelectedId(null); }}>
                        Cancelar
                    </button>
                </form>
            )}
        </div>
    );
};

export default ActualizarDisfraz;
