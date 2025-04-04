import React, { useState, useEffect } from "react";

const ActualizarDisfraz = () => {
    const [disfraces, setDisfraces] = useState([]); // Lista de disfraces
    const [formData, setFormData] = useState({
        nombre: "",
        talla: "",
        calidad: "",
        categoria: "",
        precio: "",
        festividad: "",
        descripcion: "",
        imagen: null
    });
    const [selectedId, setSelectedId] = useState(null); // ID del disfraz seleccionado

    // Obtener la lista de disfraces al montar el componente
    useEffect(() => {
        const fetchDisfraces = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/listar`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}` 
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al obtener la lista de disfraces");
                }

                const data = await response.json();
                setDisfraces(data); 
            } catch (error) {
                console.error("Error al cargar los disfraces:", error);
                alert("Hubo un problema al cargar los disfraces");
            }
        };

        fetchDisfraces();
    }, []);

    
    const fetchDetalleDisfraz = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/detalle/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}` 
                }
            });

            if (!response.ok) {
                throw new Error("Error al obtener los detalles del disfraz");
            }

            const data = await response.json();
            setFormData(data); 
            setSelectedId(id); 
        } catch (error) {
            console.error("Error al cargar los detalles del disfraz:", error);
            alert("Hubo un problema al cargar los detalles del disfraz");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            imagen: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === "imagen" && formData.imagen) {
                formDataToSend.append("imagen", formData.imagen);
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/actualizar/${selectedId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}` 
                },
                body: formDataToSend
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el disfraz");
            }

            const data = await response.json();
            alert("Disfraz actualizado exitosamente");
            console.log("Disfraz actualizado:", data);
        } catch (error) {
            console.error("Error al actualizar el disfraz:", error);
            alert("Hubo un problema al actualizar el disfraz");
        }
    };

    return (
        <div className="form-container">
            <h2>Lista de Disfraces</h2>
            {disfraces.length > 0 ? (
                <ul>
                    {disfraces.map((disfraz) => (
                        <li key={disfraz.id}>
                            <strong>Nombre:</strong> {disfraz.nombre} <br />
                            <strong>Precio:</strong> ${disfraz.precio} <br />
                            <button
                                onClick={() => fetchDetalleDisfraz(disfraz.id)}
                                className="edit-button"
                            >
                                Editar
                            </button>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay disfraces disponibles.</p>
            )}

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
                        <input
                            type="text"
                            id="festividad"
                            name="festividad"
                            className="form-input1"
                            value={formData.festividad}
                            onChange={handleChange}
                            required
                        />
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
                        <label htmlFor="imagen">Imagen:</label>
                        <input
                            type="file"
                            id="imagen"
                            name="imagen"
                            className="form-input2"
                            onChange={handleFileChange}
                        />
                    </div>
                    <button type="submit" className="form-button">Guardar Cambios</button>
                </form>
            )}
        </div>
    );
};

export default ActualizarDisfraz;