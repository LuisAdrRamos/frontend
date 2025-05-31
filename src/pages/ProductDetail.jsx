import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetail.css";
import DisfracesContext from "../context/ProductosProvider";
import Mapa from "../components/mapa";

const ProductDetail = () => {
    const { obtenerDetalleDisfraz } = useContext(DisfracesContext);
    const { disfraces } = useContext(DisfracesContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para formatear la fecha de la festividad
    const formatFestividad = (festividad) => {
        return `${festividad.nombre} - ${festividad.dia} de ${festividad.mes}`;
    };

    // Ordenar festividades por mes y día
    const ordenarFestividades = (festividades) => {
        const mesesOrden = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        return [...festividades].sort((a, b) => {
            const mesA = mesesOrden.indexOf(a.mes);
            const mesB = mesesOrden.indexOf(b.mes);

            if (mesA !== mesB) return mesA - mesB;
            return a.dia - b.dia;
        });
    };

    useEffect(() => {
        const cargarDetalle = async () => {
            try {
                setLoading(true);
                const disfraz = await obtenerDetalleDisfraz(id);

                if (disfraz) {
                    // Ordenar las festividades si existen
                    if (disfraz.festividades && disfraz.festividades.length > 0) {
                        disfraz.festividades = ordenarFestividades(disfraz.festividades);
                    }
                    setProduct(disfraz);
                } else {
                    setError("Producto no encontrado");
                }
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar el detalle del disfraz:", error);
                setError("Error al cargar los detalles del producto");
                setLoading(false);
            }
        };
        cargarDetalle();
    }, [id, obtenerDetalleDisfraz]);

    if (loading) {
        return <div className="loading-message">Cargando detalles del producto...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!product) {
        return <div className="producto-no-encontrado">Producto no encontrado</div>;
    }

    const productImages = product.imagenes || [];
    const similares = disfraces.filter(item => item.id !== parseInt(id, 10));

    const handleProductClick = (item) => {
        navigate(`/productos/${item.id}`);
    };

    return (
        <div className="parent-ProductDetail">
            {/* Sección de Imágenes */}
            <div className="product-img">
                <div id="carouselExampleIndicators" className="carousel slide">
                    <div className="carousel-indicators">
                        {productImages.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="#carouselExampleIndicators"
                                data-bs-slide-to={index}
                                className={index === 0 ? "active" : ""}
                                aria-label={`Slide ${index + 1}`}
                            ></button>
                        ))}
                    </div>
                    <div className="carousel-inner">
                        {productImages.map((image, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                <img src={image} className="d-block w-100" alt={product.nombre} />
                            </div>
                        ))}
                    </div>
                    {productImages.length > 1 && (
                        <>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Sección de Información - Manteniendo el formato exacto de la imagen */}
            <div className="product-info">
                <p><strong>Nombre:</strong> {product.nombre}</p>
                <p><strong>Descripción:</strong> {product.descripcion || "No hay descripción disponible."}</p>

                {/* Mostrar múltiples festividades */}
                <p><strong>Evento:</strong>
                    {product.festividades && product.festividades.length > 0 ? (
                        <ul className="festividades-list">
                            {product.festividades.map((festividad, index) => (
                                <li key={festividad.id || index}>
                                    {formatFestividad(festividad)}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        "Evento no disponible"
                    )}
                </p>

                <p><strong>Etiquetas:</strong></p>
                <ul className="product-prendas">
                    {product.etiquetas && product.etiquetas.length > 0 ? (
                        product.etiquetas.map((etiqueta) => (
                            <li key={etiqueta.id}>{etiqueta.nombre}</li>
                        ))
                    ) : (
                        <li>No hay etiquetas disponibles.</li>
                    )}
                </ul>
            </div>

            <div>
                {/* <Mapa /> */}
            </div>

            {/* Sección de Productos Similares */}
            <div className="product-related">
                <h2>Productos con misma etiqueta</h2>
                <div className="productos-similares-container">
                    <div className="productos-similares-lista">
                        {similares.slice(0, 6).map((item, idx) => (
                            <div
                                key={idx}
                                className="producto-similar"
                                onClick={() => handleProductClick(item)}
                            >
                                <img src={item.imagenes[0]} alt={item.nombre} />
                                <p>{item.nombre}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <h2>Productos del mismo eventos</h2>
                <div className="productos-similares-container">
                    <div className="productos-similares-lista">
                        {similares.slice(0, 6).map((item, idx) => (
                            <div
                                key={idx}
                                className="producto-similar"
                                onClick={() => handleProductClick(item)}
                            >
                                <img src={item.imagenes[0]} alt={item.nombre} />
                                <p>{item.nombre}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <h2>Productos del mismo mes</h2>
                <div className="productos-similares-container">
                    <div className="productos-similares-lista">
                        {similares.slice(0, 6).map((item, idx) => (
                            <div
                                key={idx}
                                className="producto-similar"
                                onClick={() => handleProductClick(item)}
                            >
                                <img src={item.imagenes[0]} alt={item.nombre} />
                                <p>{item.nombre}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;