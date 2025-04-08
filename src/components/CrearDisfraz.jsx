import React, { useState, useEffect } from "react";

const CrearDisfraz = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        etiquetas: [], // Lista de etiquetas seleccionadas
        festividad: "",
        descripcion: "",
        imagenes: [] 
    });

    const [eventos, setEventos] = useState([]); // Lista de eventos disponibles
    const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([]); // Lista de etiquetas disponibles


    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/festividades`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}` 
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al obtener las festividades");
                }

                const data = await response.json();
                setEventos(data); 
            } catch (error) {
                console.error("Error al cargar las festividades:", error);
                alert("Hubo un problema al cargar las festividades");
            }
        };

        const fetchEtiquetas = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/etiquetas`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}` 
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al obtener las etiquetas");
                }

                const data = await response.json();
                setEtiquetasDisponibles(data); 
            } catch (error) {
                console.error("Error al cargar las etiquetas:", error);
                alert("Hubo un problema al cargar las etiquetas");
            }
        };

        fetchEventos();
        fetchEtiquetas();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleEtiquetaChange = (e) => {
        const value = e.target.value;
        if (value && !formData.etiquetas.includes(value)) {
            setFormData({
                ...formData,
                etiquetas: [...formData.etiquetas, value]
            });
        }
    };

    const handleRemoveEtiqueta = (etiqueta) => {
        setFormData({
            ...formData,
            etiquetas: formData.etiquetas.filter((e) => e !== etiqueta)
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 3) {
            alert("Solo puedes subir un máximo de 3 imágenes");
            return;
        }
        setFormData({
            ...formData,
            imagenes: files
        });
    };

    const uploadImagesToCloudinary = async () => {
        const uploadedImageUrls = [];

        for (const image of formData.imagenes) {
            const formDataToUpload = new FormData();
            formDataToUpload.append("file", image);
            formDataToUpload.append("upload_preset", "tu_upload_preset"); 

            try {
                const response = await fetch("https://api.cloudinary.com/v1_1/tu_cloud_name/image/upload", {
                    method: "POST",
                    body: formDataToUpload
                });

                if (!response.ok) {
                    throw new Error("Error al subir la imagen a Cloudinary");
                }

                const data = await response.json();
                uploadedImageUrls.push(data.secure_url); 
            } catch (error) {
                console.error("Error al subir la imagen:", error);
                alert("Hubo un problema al subir las imágenes");
                return null;
            }
        }

        return uploadedImageUrls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const imageUrls = await uploadImagesToCloudinary();
        if (!imageUrls) return;

        const dataToSend = {
            ...formData,
            imagenes: imageUrls 
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/registro`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}` 
                },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                throw new Error("Error al crear el disfraz");
            }

            const data = await response.json();
            alert("Disfraz creado exitosamente");
            console.log("Disfraz creado:", data);
        } catch (error) {
            console.error("Error al crear el disfraz:", error);
            alert("Hubo un problema al crear el disfraz");
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
                    <label htmlFor="etiquetas">Etiquetas:</label>
                    <select
                        id="etiquetas"
                        name="etiquetas"
                        className="form-input1"
                        onChange={handleEtiquetaChange}
                    >
                        <option value="">Seleccione una etiqueta</option>
                        {etiquetasDisponibles.map((etiqueta) => (
                            <option key={etiqueta.id} value={etiqueta.nombre}>
                                {etiqueta.nombre}
                            </option>
                        ))}
                    </select>
                    <ul className="etiquetas-list">
                        {formData.etiquetas.map((etiqueta, index) => (
                            <li key={index}>
                                {etiqueta}{" "}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveEtiqueta(etiqueta)}
                                    className="remove-button"
                                >
                                    X
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="form-group">
                    <label htmlFor="festividad">Festividad:</label>
                    <select
                        id="festividad"
                        name="festividad"
                        className="form-input1"
                        value={formData.festividad}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione una festividad</option>
                        {eventos.map((evento) => (
                            <option key={evento.id} value={evento.id}>
                                {evento.nombre} - {evento.mes}/{evento.dia}
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
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="imagenes">Imágenes (máximo 3):</label>
                    <input
                        type="file"
                        id="imagenes"
                        name="imagenes"
                        className="form-input2"
                        onChange={handleFileChange}
                        multiple
                        required
                    />
                </div>
                <button type="submit" className="form-button">Crear Disfraz</button>
            </form>
        </div>
    );
};

export default CrearDisfraz;