import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetail.css";
import { products, newArrivals } from "./Home";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const decodedId = decodeURIComponent(id).toLowerCase();
    const product = [...products, ...newArrivals].find(
        item => item.name.toLowerCase() === decodedId
    );

    if (!product) {
        return <div className="producto-no-encontrado">Producto no encontrado</div>;
    }

    const productImages = product.images ? product.images : [product.img];

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
                                <img src={image} className="d-block w-100" alt={product.name} />
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
                <h2>{product.name}</h2>
                <p className="producto-precio">Precio: {product.price}</p>
                <p className="producto-descripcion">{product.description || "No hay descripción disponible."}</p>
                <button className="btn-comprar">Añadir al Carrito</button>
            </div>

            {/* Sección de Productos Similares con desplazamiento horizontal */}
            <div className="product-related">
                <h2>Productos Similares</h2>
                <div className="productos-similares-container">
                    <div className="productos-similares-lista">
                        {[...products, ...newArrivals].filter(item => item.name !== product.name).slice(0, 6).map((item, idx) => (
                            <div 
                                key={idx} 
                                className="producto-similar"
                                onClick={() => navigate(`/productos/${encodeURIComponent(item.name)}`)}
                            >
                                <img src={item.img} alt={item.name} />
                                <p>{item.name}</p>
                            </div>  
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProductDetail;
