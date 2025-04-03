import React, { useState, useEffect } from "react";

const CrearDisfraz = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        talla: "",
        calidad: "",
        categoria: "",
        precio: "",
        festividad: "",
        descripcion: "",
        imagenes: [] // Archivos seleccionados
    });

    const [eventos, setEventos] = useState([]); // Lista de eventos disponibles

    // Obtener la lista de eventos al montar el componente
    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/festividades`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}` // Si es necesario
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al obtener las festividades");
                }

                const data = await response.json();
                setEventos(data); // Guardar la lista de eventos
            } catch (error) {
                console.error("Error al cargar las festividades:", error);
                alert("Hubo un problema al cargar las festividades");
            }
        };

        fetchEventos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
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
                    Authorization: `Bearer ${localStorage.getItem("token")}` // Si es necesario
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
                    <label htmlFor="talla">Talla:</label>
                    <input
                        type="text"
                        id="talla"
                        name="talla"
                        className="form-input1"
                        value={formData.talla}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="calidad">Calidad:</label>
                    <input
                        type="text"
                        id="calidad"
                        name="calidad"
                        className="form-input"
                        value={formData.calidad}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="categoria">Categoría:</label>
                    <input
                        type="text"
                        id="categoria"
                        name="categoria"
                        className="form-input"
                        value={formData.categoria}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="precio">Precio:</label>
                    <input
                        type="number"
                        id="precio"
                        name="precio"
                        className="form-input1"
                        value={formData.precio}
                        onChange={handleChange}
                        required
                    />
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