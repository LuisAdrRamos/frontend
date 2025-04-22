import React, { useState, useEffect } from "react";
import '../styles/modal.css';

const ActualizarDisfraz = () => {
    const [disfraces, setDisfraces] = useState([]);
    const [filteredDisfraces, setFilteredDisfraces] = useState([]);
    const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [formData, setFormData] = useState({
        nombre: "",
        festividad: "",
        descripcion: "",
        etiquetas: [],
        imagenes: [],
        imagen: null
    });
    const [selectedId, setSelectedId] = useState(null);
    const [busqueda, setBusqueda] = useState("");

    // Obtener datos iniciales
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
                setFilteredDisfraces(disf);
                setEtiquetasDisponibles(etq);
                setEventos(evt);
            } catch (error) {
                console.error("❌ Error al cargar datos:", error);
                alert("Hubo un problema al cargar la información inicial.");
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
                disfraz.etiquetas?.some((etiqueta) =>
                    etiqueta.nombre.toLowerCase().includes(busqueda.toLowerCase())
                ) ||
                disfraz.festividad?.nombre.toLowerCase().includes(busqueda.toLowerCase())
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

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    imagenes: [...prev.imagenes, { file, preview: reader.result }]
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    // Función para eliminar previsualización de imagen
    const removePreview = (index) => {
        const nuevas = [...formData.imagenes];
        nuevas.splice(index, 1);
        setFormData({ ...formData, imagenes: nuevas });
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

                const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: "POST",
                    body: data
                });

                if (!res.ok) throw new Error("Error al subir imagen");
                return res.json();
            });

            const results = await Promise.all(uploadPromises);
            const newUrls = results.map(result => result.secure_url);
            
            // Combinar URLs existentes (que no tienen file) con las nuevas
            const existingUrls = formData.imagenes
                .filter(img => !img.file && img.url)
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
            
            // Preparar las imágenes para el estado (conservamos las URLs existentes)
            const imagenesPreparadas = data.imagenes.map(img => ({
                url: img,
                preview: img // Usamos la URL como preview para imágenes existentes
            }));
            
            setFormData({
                nombre: data.nombre,
                descripcion: data.descripcion,
                festividad: data.festividad?.id || "",
                etiquetas: data.etiquetas?.map(et => et.id) || [],
                imagenes: imagenesPreparadas,
                imagen: null
            });
            setSelectedId(id);
        } catch (error) {
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

            alert("Disfraz eliminado exitosamente");
            const updatedDisfraces = disfraces.filter((disfraz) => disfraz.id !== id);
            setDisfraces(updatedDisfraces);
            setFilteredDisfraces(updatedDisfraces);
            setBusqueda("");
        } catch (error) {
            console.error("Error al eliminar el disfraz:", error);
            alert("Hubo un problema al eliminar el disfraz");
        }
    };

    // Manejar cambios en otros campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Manejar cambios en etiquetas
    const handleEtiquetaChange = (e) => {
        const id = parseInt(e.target.value);
        if (id === -1) {
            window.location.href = "/crear-etiqueta";
        } else if (!formData.etiquetas.includes(id) && formData.etiquetas.length < 5) {
            setFormData({ ...formData, etiquetas: [...formData.etiquetas, id] });
        }
    };

    // Eliminar etiqueta
    const handleRemoveEtiqueta = (id) => {
        setFormData({ ...formData, etiquetas: formData.etiquetas.filter((e) => e !== id) });
    };

    // Enviar formulario de actualización
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            alert("Subiendo imágenes, por favor espere...");
            
            // Subir imágenes nuevas a Cloudinary
            const imagenesUrls = await uploadImagesToCloudinary();
            
            const dataToSend = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                festividadId: formData.festividad,
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
                throw new Error(result.msg || "Error al actualizar disfraz");
            }

            alert("✅ Disfraz actualizado exitosamente");
            
            // Actualizar la lista de disfraces
            const updatedDisfraces = disfraces.map(d => 
                d.id === selectedId ? { ...d, ...dataToSend } : d
            );
            setDisfraces(updatedDisfraces);
            setFilteredDisfraces(updatedDisfraces);
            
        } catch (error) {
            console.error("Error al actualizar disfraz:", error);
            alert(error.message || "❌ Error al actualizar disfraz");
        }
    };

    return (
        <div className="form-container">
            <h2>Lista de Disfraces</h2>

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

                    {/* Sección de imágenes (actualizada) */}
                    <div className="form-group">
                        <label>Imágenes (máximo 3):</label>
                        <div className="image-preview-container">
                            {formData.imagenes.map((img, idx) => (
                                <div key={idx} className="image-box">
                                    <img 
                                        src={img.preview || img.url} 
                                        alt={`preview-${idx}`} 
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
                                    <p className="add-image-text">Añadir otra imagen</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="form-button">Guardar Cambios</button>
                </form>
            )}
        </div>
    );
};

export default ActualizarDisfraz;