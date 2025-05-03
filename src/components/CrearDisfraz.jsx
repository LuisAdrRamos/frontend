import React, { useState, useEffect } from "react";
import '../styles/modal.css';

const CrearDisfraz = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        etiquetas: [],
        festividades: [],
        descripcion: "",
        imagenes: []
    });

    const [eventos, setEventos] = useState([]);
    const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([]);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Cargar festividades y etiquetas en paralelo
                const [resFestividades, resEtiquetas] = await Promise.all([
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/festividades`, {
                        headers: { 
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/etiqueta/listar`, {
                        headers: { 
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    })
                ]);

                if (!resFestividades.ok || !resEtiquetas.ok) {
                    throw new Error("Error al cargar datos iniciales");
                }

                const [dataFestividades, dataEtiquetas] = await Promise.all([
                    resFestividades.json(),
                    resEtiquetas.json()
                ]);

                setEventos(ordenarFestividades(dataFestividades || []));
                setEtiquetasDisponibles(ordenarEtiquetas(dataEtiquetas || []));
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar datos:", error);
                setError("Hubo un problema al cargar los datos necesarios");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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

    const handleRemoveEtiqueta = (id) => {
        setFormData(prev => ({
            ...prev,
            etiquetas: prev.etiquetas.filter(et => et !== id)
        }));
    };

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

    const handleRemoveFestividad = (id) => {
        setFormData(prev => ({ 
            ...prev, 
            festividades: prev.festividades.filter(fest => fest !== id) 
        }));
    };

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

    const removePreview = (index) => {
        setFormData(prev => {
            const nuevas = [...prev.imagenes];
            nuevas.splice(index, 1);
            return { ...prev, imagenes: nuevas };
        });
    };

    const uploadImagesToCloudinary = async () => {
        try {
            const uploadPromises = formData.imagenes.map(async (item) => {
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

            return await Promise.all(uploadPromises);
        } catch (error) {
            console.error("Error al subir imágenes:", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validaciones
        if (formData.imagenes.length === 0) {
            alert("❌ Debes subir al menos una imagen");
            setIsSubmitting(false);
            return;
        }

        if (formData.festividades.length === 0) {
            alert("❌ Debes seleccionar al menos una festividad");
            setIsSubmitting(false);
            return;
        }

        try {
            // Subir imágenes
            const uploadResults = await uploadImagesToCloudinary();
            const imagenesUrls = uploadResults.map(result => result.secure_url);
            
            // Preparar datos para el backend
            const dataToSend = {
                nombre: formData.nombre.trim(),
                descripcion: formData.descripcion.trim(),
                festividades: formData.festividades,
                etiquetas: formData.etiquetas,
                imagenes: imagenesUrls
            };

            // Enviar al backend
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/registro`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(dataToSend)
            });

            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData.msg || "Error al crear el disfraz");
            }

            // Éxito - resetear formulario
            alert("✅ Disfraz creado exitosamente");
            setFormData({
                nombre: "",
                etiquetas: [],
                festividades: [],
                descripcion: "",
                imagenes: []
            });

        } catch (error) {
            console.error("Error completo:", error);
            alert(error.message || "Hubo un problema al crear el disfraz");
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
            <form onSubmit={handleSubmit} className="form-content">
                <h2>Crear Disfraz</h2>

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
                        maxLength={250}
                        value={formData.descripcion}
                        onChange={handleChange}
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
                                    src={img.preview} 
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
                    {isSubmitting ? "Creando..." : "Crear Disfraz"}
                </button>
            </form>
        </div>
    );
};

export default CrearDisfraz;