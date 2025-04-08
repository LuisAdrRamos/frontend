import React, { useState, useEffect } from "react";

const BuscarEtiquetas = () => {
    const [nombreBusqueda, setNombreBusqueda] = useState("");
    const [resultado, setResultado] = useState(null);
    const [etiquetas, setEtiquetas] = useState([]); // Lista de etiquetas

    // Obtener la lista de etiquetas al montar el componente
    useEffect(() => {
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
                setEtiquetas(data); // Guardar la lista de etiquetas
            } catch (error) {
                console.error("Error al cargar las etiquetas:", error);
                alert("Hubo un problema al cargar las etiquetas");
            }
        };

        fetchEtiquetas();
    }, []);

    const handleChange = (e) => {
        setNombreBusqueda(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const etiquetaEncontrada = etiquetas.find(
            (etiqueta) => etiqueta.nombre.toLowerCase() === nombreBusqueda.toLowerCase()
        );
        setResultado(etiquetaEncontrada || null);
    };

    return (
        <div className="form-container">
            <h2 className="title-buscar-etiquetas">Buscar Etiqueta</h2>
            <form onSubmit={handleSearch} className="form-content">
                <div className="form-group">
                    <label htmlFor="nombre">Nombre de la Etiqueta:</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        className="form-input"
                        value={nombreBusqueda}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="form-button">Buscar</button>
            </form>

            {resultado ? (
                <div style={{ marginTop: "20px" }}>
                    <h3>Datos de la Etiqueta</h3>
                    <p><strong>Nombre:</strong> {resultado.nombre}</p>
                    <p><strong>Descripción:</strong> {resultado.descripcion}</p>
                </div>
            ) : (
                nombreBusqueda && <p style={{ marginTop: "20px" }}>No se encontró ninguna etiqueta con ese nombre.</p>
            )}
        </div>
    );
};

export default BuscarEtiquetas;