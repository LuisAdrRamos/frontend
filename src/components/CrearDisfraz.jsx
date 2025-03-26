import React, { useState } from "react";

const CrearDisfraz = () => {
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
        <form onSubmit={handleSubmit}>
            <h2>Crear Disfraz</h2>
            <div>
                <label htmlFor="nombre">Nombre:</label>
                <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="talla">Talla:</label>
                <input
                    type="text"
                    id="talla"
                    name="talla"
                    value={formData.talla}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="calidad">Calidad:</label>
                <input
                    type="text"
                    id="calidad"
                    name="calidad"
                    value={formData.calidad}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="categoria">Categoría:</label>
                <input
                    type="text"
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="precio">Precio:</label>
                <input
                    type="number"
                    id="precio"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="festividad">Festividad:</label>
                <input
                    type="text"
                    id="festividad"
                    name="festividad"
                    value={formData.festividad}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="descripcion">Descripción:</label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="imagen">Imagen:</label>
                <input
                    type="file"
                    id="imagen"
                    name="imagen"
                    onChange={handleFileChange}
                    required
                />
            </div>
            <button type="submit">Crear Disfraz</button>
        </form>
    );
};

export default CrearDisfraz;