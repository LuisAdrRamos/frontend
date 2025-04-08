import React, { useState, useEffect } from "react";

const ActualizarDisfraz = () => {
    const [disfraces, setDisfraces] = useState([]); // Lista de disfraces
    const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([]); // Lista de etiquetas disponibles
    const [formData, setFormData] = useState({
        nombre: "",
        festividad: "",
        descripcion: "",
        etiquetas: [], // Lista de etiquetas seleccionadas
        imagen: null
    });
    const [selectedId, setSelectedId] = useState(null); // ID del disfraz seleccionado

    // Obtener la lista de disfraces y etiquetas al montar el componente
    useEffect(() => {
        const fetchDisfraces = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/listar`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}` // Si es necesario
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al obtener la lista de disfraces");
                }

                const data = await response.json();
                setDisfraces(data); // Guardar la lista de disfraces
            } catch (error) {
                console.error("Error al cargar los disfraces:", error);
                alert("Hubo un problema al cargar los disfraces");
            }
        };

        const fetchEtiquetas = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/etiquetas`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}` // Si es necesario
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al obtener las etiquetas");
                }

                const data = await response.json();
                setEtiquetasDisponibles(data); // Guardar la lista de etiquetas
            } catch (error) {
                console.error("Error al cargar las etiquetas:", error);
                alert("Hubo un problema al cargar las etiquetas");
            }
        };

        fetchDisfraces();
        fetchEtiquetas();
    }, []);

    // Obtener los detalles de un disfraz específico
    const fetchDetalleDisfraz = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/detalle/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}` // Si es necesario
                }
            });

            if (!response.ok) {
                throw new Error("Error al obtener los detalles del disfraz");
            }

            const data = await response.json();
            setFormData(data); // Rellenar el formulario con los datos del disfraz
            setSelectedId(id); // Guardar el ID del disfraz seleccionado
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
        setFormData({
            ...formData,
            imagen: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Crear un objeto FormData para enviar datos con archivos
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === "imagen" && formData.imagen) {
                formDataToSend.append("imagen", formData.imagen);
            } else if (key === "etiquetas") {
                formData.etiquetas.forEach((etiqueta) => {
                    formDataToSend.append("etiquetas[]", etiqueta);
                });
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/actualizar/${selectedId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}` // Si es necesario
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