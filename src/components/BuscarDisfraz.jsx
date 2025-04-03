import React, { useState, useEffect } from "react";

const BuscarDisfraz = () => {
    const [disfraces, setDisfraces] = useState([]);
    const [detalleDisfraz, setDetalleDisfraz] = useState(null); 
    const [selectedId, setSelectedId] = useState(null); 
   
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
            setDetalleDisfraz(data); 
        } catch (error) {
            console.error("Error al cargar los detalles del disfraz:", error);
            alert("Hubo un problema al cargar los detalles del disfraz");
        }
    };

    const handleVerDetalle = (id) => {
        setSelectedId(id); 
        fetchDetalleDisfraz(id); 
    };

    return (
        <div>
            <h2 className="title-disfraces">Lista de Disfraces</h2>
            {disfraces.length > 0 ? (
                <ul>
                    {disfraces.map((disfraz) => (
                        <li key={disfraz.id} className="form-content1">
                            <strong>Nombre:</strong> {disfraz.nombre} <br />
                            <strong>Precio:</strong> ${disfraz.precio} <br />
                            <button
                                onClick={() => handleVerDetalle(disfraz.id)}
                                className="detail-button"
                            >
                                Ver Detalles
                            </button>
                            <hr />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay disfraces disponibles.</p>
            )}

            {detalleDisfraz && selectedId === detalleDisfraz.id && (
                <div className="detalle-disfraz">
                    <h3>Detalles del Disfraz</h3>
                    <strong>Nombre:</strong> {detalleDisfraz.nombre} <br />
                    <strong>Talla:</strong> {detalleDisfraz.talla} <br />
                    <strong>Calidad:</strong> {detalleDisfraz.calidad} <br />
                    <strong>Categoría:</strong> {detalleDisfraz.categoria} <br />
                    <strong>Precio:</strong> ${detalleDisfraz.precio} <br />
                    <strong>Festividad:</strong> {detalleDisfraz.festividad} <br />
                    <strong>Descripción:</strong> {detalleDisfraz.descripcion} <br />
                    {detalleDisfraz.imagenes &&
                        detalleDisfraz.imagenes.map((imagen, index) => (
                            <img
                                key={index}
                                src={imagen}
                                alt={detalleDisfraz.nombre}
                                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                            />
                        ))}
                </div>
            )}
        </div>
    );
};

export default BuscarDisfraz;