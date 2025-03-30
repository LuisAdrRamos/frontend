import React, { useState } from "react";

const ActualizarDisfraz = () => {
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

    const handleSubmit = (e) => {   
        e.preventDefault();
        console.log("Disfraz creado:", formData);
        // Aquí puedes manejar el envío del formulario, como enviarlo a una API
    };

    return (
        <div className="form-container">
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
                        required
                    />
                </div>
                <button type="submit" className="form-button">Editar</button>
            </form>
        </div>
    );
};

export default ActualizarDisfraz;