import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetail.css";
import DisfracesContext from "../context/ProductosProvider";

const ProductDetail = () => {
    const { obtenerDetalleDisfraz } = useContext(DisfracesContext); // Método del contexto para obtener el detalle
    const { disfraces } = useContext(DisfracesContext); // Todos los disfraces
    const { id } = useParams(); // ID del disfraz desde la URL
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const cargarDetalle = async () => {
            try {
                const disfraz = await obtenerDetalleDisfraz(id); // Llama al backend
                setProduct(disfraz);
            } catch (error) {
                console.error("Error al cargar el detalle del disfraz:", error);
            }
        };
        cargarDetalle();
    }, [id, obtenerDetalleDisfraz]);

    if (!product) {
        return <div className="producto-no-encontrado">Producto no encontrado</div>;
    }

    const productImages = product.imagenes || []; // Manejo seguro de las imágenes
    const similares = disfraces.filter(item => item.id !== parseInt(id, 10)); // Filtrar disfraces similares

    const handleProductClick = (item) => {
        navigate(`/productos/${item.id}`); // Navegar al detalle del disfraz similar
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

            {/* Sección de Información */}
            <div className="product-info">
                <p><strong>NOMBRE:</strong> {product.nombre}</p>
                <p><strong>DESCRIPCIÓN:</strong> {product.descripcion || "No hay descripción disponible."}</p>
                <p><strong>EVENTO:</strong> {product.evento || "Batalla de Pichincha - 24 de Mayo"}</p>
                <p><strong>PRENDAS:</strong></p>
                <ul className="product-prendas">
                    {product.etiquetas && product.etiquetas.length > 0 ? (
                        product.etiquetas.map((etiqueta, index) => (
                            <li key={etiqueta.id}>{etiqueta.nombre}</li> // Accedemos directamente a la propiedad 'nombre'
                        ))
                    ) : (
                        <li>No hay etiquetas disponibles.</li>
                    )}
                </ul>
            </div>


            {/* Sección de Productos Similares */}
            <div className="product-related">
                <h2>Productos Similares</h2>
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
