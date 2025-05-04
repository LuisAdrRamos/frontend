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

    // Función para ordenar festividades por mes y día
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

    // Función para ordenar etiquetas alfabéticamente
    const ordenarEtiquetas = (etiquetas) => {
        return [...etiquetas].sort((a, b) => a.nombre.localeCompare(b.nombre));
    };

    // Obtener datos iniciales
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [resDisfraces, resEtiquetas, resFestividades] = await Promise.all([
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

    // Filtrar disfraces
    useEffect(() => {
        if (busqueda.trim() === "") {
            setFilteredDisfraces(disfraces);
        } else {
            const filtered = disfraces.filter((disfraz) =>
                disfraz.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                disfraz.etiquetas?.some(etiqueta =>
                    etiqueta.nombre.toLowerCase().includes(busqueda.toLowerCase())
                ) ||
                disfraz.festividades?.some(festividad =>
                    festividad.nombre.toLowerCase().includes(busqueda.toLowerCase())
                )
            );
            setFilteredDisfraces(filtered);
        }
    }, [busqueda, disfraces]);

    // Función para manejar cambios en archivos de imagen
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.imagenes.length > 3) {
            alert("❌ Solo puedes subir un máximo de 3 imágenes");
            return;
        }

        const newImages = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve({ file, preview: reader.result });
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(newImages).then(images => {
            setFormData(prev => ({
                ...prev,
                imagenes: [...prev.imagenes, ...images]
            }));
        });
    };

    // Función para eliminar previsualización de imagen
    const removePreview = (index) => {
        setFormData(prev => {
            const nuevas = [...prev.imagenes];
            nuevas.splice(index, 1);
            return { ...prev, imagenes: nuevas };
        });
    };

    // Función para subir imágenes a Cloudinary
    const uploadImagesToCloudinary = async () => {
        try {
            // Filtrar solo las imágenes nuevas (que tienen file)
            const newImages = formData.imagenes.filter(img => img.file);
            
            const uploadPromises = newImages.map(async (item) => {
                const data = new FormData();
                data.append("file", item.file);
                data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    { method: "POST", body: data }
                );

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Error al subir imagen");
                }
                return res.json();
            });

            const results = await Promise.all(uploadPromises);
            const newUrls = results.map(result => result.secure_url);
            
            // Combinar URLs existentes (que no tienen file) con las nuevas
            const existingUrls = formData.imagenes
                .filter(img => !img.file && (img.url || img.preview))
                .map(img => img.url || img.preview);
            
            return [...existingUrls, ...newUrls];
        } catch (error) {
            console.error("Error al subir imágenes:", error);
            throw error;
        }
    };

    // Cargar detalles del disfraz seleccionado
    const fetchDetalleDisfraz = async (id) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/detalle/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            const data = await res.json();
            
            // Preparar las imágenes para el estado
            const imagenesPreparadas = data.imagenes.map(img => ({
                url: img,
                preview: img
            }));
            
            setFormData({
                nombre: data.nombre,
                descripcion: data.descripcion,
                festividades: data.festividades?.map(f => f.id) || [],
                etiquetas: data.etiquetas?.map(et => et.id) || [],
                imagenes: imagenesPreparadas
            });
            setSelectedId(id);
        } catch (error) {
            console.error("Error al cargar detalles del disfraz:", error);
            alert("Error al cargar detalles del disfraz");
        }
    };

    // Eliminar disfraz
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

            alert("✅ Disfraz eliminado exitosamente");
            const updatedDisfraces = disfraces.filter((disfraz) => disfraz.id !== id);
            setDisfraces(updatedDisfraces);
            setFilteredDisfraces(updatedDisfraces);
            setSelectedId(null);
            setBusqueda("");
        } catch (error) {
            console.error("❌ Error al eliminar el disfraz:", error);
            alert("❌ Hubo un problema al eliminar el disfraz");
        }
    };

    // Manejar cambios en otros campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Manejar cambios en etiquetas
    const handleEtiquetaChange = (e) => {
        const id = parseInt(e.target.value);
        if (id === -1) {
            window.location.href = "/etiquetas";
            return;
        }

        if (!formData.etiquetas.includes(id)) {
            if (formData.etiquetas.length < 6) {
                setFormData(prev => ({ 
                    ...prev, 
                    etiquetas: [...prev.etiquetas, id] 
                }));
            } else {
                alert("❌ Máximo 6 etiquetas permitidas");
            }
        }
    };

    // Eliminar etiqueta
    const handleRemoveEtiqueta = (id) => {
        setFormData(prev => ({
            ...prev,
            etiquetas: prev.etiquetas.filter(et => et !== id)
        }));
    };

    // Manejar cambios en festividades
    const handleFestividadChange = (e) => {
        const id = parseInt(e.target.value);
        if (id === -1) {
            window.location.href = "/eventos";
            return;
        }

        if (!formData.festividades.includes(id)) {
            if (formData.festividades.length < 5) {
                setFormData(prev => ({ 
                    ...prev, 
                    festividades: [...prev.festividades, id] 
                }));
            } else {
                alert("❌ Máximo 5 festividades permitidas");
            }
        }
    };

    // Eliminar festividad
    const handleRemoveFestividad = (id) => {
        setFormData(prev => ({ 
            ...prev, 
            festividades: prev.festividades.filter(fest => fest !== id) 
        }));
    };

    // Enviar formulario de actualización
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validaciones
            if (formData.imagenes.length === 0) {
                alert("❌ Debes tener al menos una imagen");
                setIsSubmitting(false);
                return;
            }

            if (formData.festividades.length === 0) {
                alert("❌ Debes seleccionar al menos una festividad");
                setIsSubmitting(false);
                return;
            }

            if (formData.etiquetas.length > 6) {
                alert("❌ Máximo 6 etiquetas permitidas");
                setIsSubmitting(false);
                return;
            }

            if (formData.descripcion.length > 250) {
                alert("❌ La descripción no puede exceder los 250 caracteres");
                setIsSubmitting(false);
                return;
            }

            // Subir imágenes nuevas a Cloudinary
            const imagenesUrls = await uploadImagesToCloudinary();
            
            const dataToSend = {
                nombre: formData.nombre.trim(),
                descripcion: formData.descripcion.trim(),
                festividades: formData.festividades,
                etiquetas: formData.etiquetas,
                imagenes: imagenesUrls
            };

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/actualizar/${selectedId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(dataToSend)
            });
            
            const result = await res.json();
            
            if (!res.ok) {
                throw new Error(result.msg || "❌ Error al actualizar disfraz");
            }

            alert("✅ Disfraz actualizado exitosamente");
            
            // Actualizar la lista de disfraces
            const updatedDisfraces = disfraces.map(d => 
                d.id === selectedId ? { ...d, ...dataToSend } : d
            );
            setDisfraces(updatedDisfraces);
            setFilteredDisfraces(updatedDisfraces);
            
        } catch (error) {
            console.error("❌ Error al actualizar disfraz:", error);
            alert(error.message || "❌ Error al actualizar disfraz");
        } finally {
            setIsSubmitting(false);
        }
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
                <button 
                    className="form-button"
                    onClick={() => window.location.reload()}
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="form-container">
            <h2 className="titlelistDis">Lista de Disfraces</h2>

            {/* Buscador */}
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

            {/* Lista de disfraces */}
            <ul className="disfraz-list">
                {filteredDisfraces.map((disfraz) => (
                    <li key={disfraz.id} className="disfraz-item">
                        <div className="disfraz-info">
                            <strong>Nombre:</strong> {disfraz.nombre} <br />
                            <strong>Etiquetas:</strong> {disfraz.etiquetas?.map(e => e.nombre).join(", ") || "Sin etiquetas"}<br />
                            <strong>Festividades:</strong> {disfraz.festividades?.map(f => f.nombre).join(", ") || "Sin festividades"}<br />
                        </div>
                        <div className="disfraz-actions">
                            <button
                                onClick={() => fetchDetalleDisfraz(disfraz.id)}
                                className="edit-button2"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(disfraz.id)}
                                className="delete-button2"
                            >
                                Eliminar
                            </button>
                        </div>
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
                </form>
            )}
        </div>
    );
};

export default ActualizarDisfraz;