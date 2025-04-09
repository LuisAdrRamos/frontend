import React, { useState, useEffect } from "react";

const ActualizarDisfraz = () => {
    const [disfraces, setDisfraces] = useState([]);
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
                setEtiquetasDisponibles(etq);
                setEventos(evt);
            } catch (error) {
                console.error("❌ Error al cargar datos:", error);
                alert("Hubo un problema al cargar la información inicial.");
            }
        };
        fetchData();
    }, []);

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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({
                ...formData,
                imagen: file,
                imagenes: [...formData.imagenes, reader.result]
            });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let imagenes = formData.imagenes;
        if (formData.imagen) {
            const data = new FormData();
            data.append("file", formData.imagen);
            data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

            try {
                const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: "POST",
                    body: data
                });
                const file = await res.json();
                imagenes = [file.secure_url];
            } catch (error) {
                alert("Error al subir imagen");
                return;
            }
        }

        const dataToSend = {
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            festividadId: formData.festividad,
            etiquetas: formData.etiquetas,
            imagenes
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
            <ul>
                {disfraces.map((disfraz) => (
                    <li key={disfraz.id}>
                        <strong>Nombre:</strong> {disfraz.nombre} <br />
                        <strong>Etiquetas:</strong> {disfraz.etiquetas?.map(e => e.nombre).join(", ") || "Sin etiquetas"}<br />
                        <strong>Festividad:</strong> {disfraz.festividad?.nombre || "Sin festividad"}<br />
                        <button onClick={() => fetchDetalleDisfraz(disfraz.id)} className="edit-button">
                            Editar
                        </button>
                        <hr />
                    </li>
                ))}
            </ul>

            {selectedId && (
                <form onSubmit={handleSubmit} className="form-content">
                    <h2>Editar Disfraz</h2>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input type="text" id="nombre" name="nombre" className="form-input" value={formData.nombre} onChange={handleChange} required />
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
                        <select className="form-input1" name="festividad" value={formData.festividad} onChange={handleChange} required>
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
                        <textarea id="descripcion" name="descripcion" className="form-input1" value={formData.descripcion} onChange={handleChange} maxLength={250} required />
                        <p>{formData.descripcion.length} / 250 caracteres</p>
                    </div>

                    <div className="form-group">
                        <label>Imágenes (máx. 3):</label>
                        <div className="image-preview-container">
                            {formData.imagenes.map((url, idx) => (
                                <div key={idx} className="image-box">
                                    <img src={url} alt={`img-${idx}`} className="preview-img" />
                                    <button type="button" className="remove-button" onClick={() => {
                                        const nuevas = [...formData.imagenes];
                                        nuevas.splice(idx, 1);
                                        setFormData({ ...formData, imagenes: nuevas });
                                    }}>
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
                                        />
                                    </label>
                                    <p>Añadir otra imagen</p>
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
