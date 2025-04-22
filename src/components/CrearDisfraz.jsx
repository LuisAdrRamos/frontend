import React, { useState, useEffect } from "react";
import '../styles/modal.css';

const CrearDisfraz = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        etiquetas: [],
        festividad: "",
        descripcion: "",
        imagenes: []
    });

    const [eventos, setEventos] = useState([]);
    const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([]);

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/festividades`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                const data = await res.json();
                setEventos(data);
            } catch (error) {
                console.error("Error al cargar festividades:", error);
                alert("❌ Hubo un problema al cargar las festividades");
            }
        };

        const fetchEtiquetas = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/etiqueta/listar`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                const data = await res.json();
                setEtiquetasDisponibles(data);
            } catch (error) {
                console.error("Error al cargar etiquetas:", error);
                alert("❌ Hubo un problema al cargar las etiquetas");
            }
        };

        fetchEventos();
        fetchEtiquetas();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEtiquetaChange = (e) => {
        const id = parseInt(e.target.value);
        if (id === -1) {
            window.location.href = "/crear-etiqueta";
            return;
        }

        if (!formData.etiquetas.includes(id) && formData.etiquetas.length < 5) {
            setFormData({ ...formData, etiquetas: [...formData.etiquetas, id] });
        }
    };

    const handleRemoveEtiqueta = (id) => {
        setFormData({
            ...formData,
            etiquetas: formData.etiquetas.filter((et) => et !== id)
        });
    };

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

    const removePreview = (index) => {
        const nuevas = [...formData.imagenes];
        nuevas.splice(index, 1);
        setFormData({ ...formData, imagenes: nuevas });
    };

    const uploadImagesToCloudinary = async () => {
        try {
            const uploadPromises = formData.imagenes.map(async (item) => {
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
            return results.map(result => result.secure_url);
        } catch (error) {
            console.error("Error al subir imágenes:", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.imagenes.length === 0) {
            alert("❌ Debes subir al menos una imagen");
            return;
        }

        try {
            // Mostrar un indicador de carga
            alert("Subiendo imágenes, por favor espere...");

            const imagenes = await uploadImagesToCloudinary();
            const dataToSend = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                festividadId: formData.festividad,
                etiquetas: formData.etiquetas,
                imagenes // Esto ahora debería contener todas las URLs
            };

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
                throw new Error(responseData.msg || "❌ Error al crear el disfraz");
            }

            alert("✅ Disfraz creado exitosamente");
            // Redirigir o resetear el formulario
            setFormData({
                nombre: "",
                etiquetas: [],
                festividad: "",
                descripcion: "",
                imagenes: []
            });
        } catch (error) {
            console.error(error);
            alert(error.message || "❌ Hubo un problema al crear el disfraz");
        }
    };

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
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="etiquetas">Etiquetas (máx. 5):</label>
                    <select
                        id="etiquetas"
                        name="etiquetas"
                        className="form-input1"
                        onChange={handleEtiquetaChange}
                    >
                        <option value="">Seleccione una etiqueta</option>
                        {etiquetasDisponibles.map((et) => (
                            <option key={et.id} value={et.id}>{et.nombre}</option>
                        ))}
                        <option value="-1">➕ Crear nueva etiqueta</option>
                    </select>
                    <ul className="etiquetas-list">
                        {formData.etiquetas.map((id, idx) => {
                            const etiqueta = etiquetasDisponibles.find(e => e.id === id);
                            return (
                                <li key={idx}>
                                    {etiqueta?.nombre || "Etiqueta desconocida"}{" "}
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
                    <p>{formData.etiquetas.length} / 5 etiquetas seleccionadas</p>
                </div>

                <div className="form-group">
                    <label htmlFor="festividad">Festividad:</label>
                    <select
                        id="festividad"
                        name="festividad"
                        className="form-input1"
                        value={formData.festividad}
                        onChange={(e) => {
                            if (e.target.value === "crear") {
                                window.location.href = "/eventos";
                            } else {
                                handleChange(e);
                            }
                        }}
                        required
                    >
                        <option value="">Seleccione una festividad</option>
                        {eventos.map((ev) => (
                            <option key={ev.id} value={ev.id}>
                                {ev.nombre} - {ev.mes}/{ev.dia}
                            </option>
                        ))}
                        <option value="crear">➕ Crear nueva festividad</option>
                    </select>
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
                    <p>{formData.descripcion.length} / 250 caracteres</p>
                </div>

                <div className={["form-group"]}>
                    <label>Imágenes (máximo 3):</label>
                    <div className={["image-preview-container"]}>
                        {formData.imagenes.map((img, idx) => (
                            <div key={idx} className={["image-box"]}>
                                <img src={img.preview} alt={`preview-${idx}`} className={["preview-img"]} />
                                <button
                                    type="button"
                                    className={["remove-button"]}
                                    onClick={() => removePreview(idx)}
                                    aria-label="Eliminar imagen"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                        {formData.imagenes.length < 3 && (
                            <div className={`${["image-box"]} ${["upload-box"]}`}>
                                <label className={["add-image-label"]}>
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
                                <p className={["add-image-text"]}>Añadir otra imagen</p>
                            </div>
                        )}
                    </div>
                </div>

                <button type="submit" className="form-button">Crear Disfraz</button>
            </form>
        </div>
    );
};

export default CrearDisfraz;
