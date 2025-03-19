import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Productos.css";  

// Importar datos de productos
import { products, newArrivals } from "./Home";

const Productos = () => {
    const { id } = useParams(); // ✅ Obtiene el nombre del producto desde la URL
    const navigate = useNavigate();

    // ✅ Buscar el producto en la lista
    const product = [...products, ...newArrivals].find(item => item.name === decodeURIComponent(id));

    const [index, setIndex] = useState(0);

    if (!product) {
        return <div className="productos-container"><h2>Producto no encontrado</h2></div>;
    }

    // ✅ Manejar cambio de imágenes en el carrusel
    const nextSlide = () => {
        setIndex((prevIndex) => (prevIndex + 1) % (product.images ? product.images.length : 1));
    };

    const prevSlide = () => {
        setIndex((prevIndex) => (prevIndex - 1 + (product.images ? product.images.length : 1)) % (product.images ? product.images.length : 1));
    };

    // ✅ Filtrar productos similares (excluye el actual)
    const similares = [...products, ...newArrivals].filter(item => item.name !== product.name);

    // ✅ Redirigir al nuevo producto seleccionado
    const handleProductClick = (product) => {
        navigate(`/productos/${encodeURIComponent(product.name)}`);
    };

    return (
        <div className="productos-container">
            <section className="productos-section">
                <h2 className="productos-titulo">{product.name}</h2>

                {/* ✅ Carrusel de imágenes */}
                {product.images ? (
                    <>
                        <div className="productos-carousel">
                            <button onClick={prevSlide}>&#9665;</button>
                            <img src={product.images[index].src} alt={product.images[index].alt} />
                            <button onClick={nextSlide}>&#9655;</button>
                        </div>

                        <div className="productos-indicadores">
                            {product.images.map((_, i) => (
                                <span
                                    key={i}
                                    className={`productos-indicador ${i === index ? 'activo' : ''}`}
                                ></span>
                            ))}
                        </div>
                    </>
                ) : (
                    <img src={product.img} alt={product.name} />
                )}

                <div className="productos-detalles">
                    <p><strong>Nombre:</strong> {product.name}</p>
                    <p><strong>Precio:</strong> {product.price}</p>
                    {product.description && <p><strong>Descripción:</strong> {product.description}</p>}

                    <p><strong>IMPLEMENTOS:</strong></p>
                    <div className="productos-implementos">
                        {["Chaqueta decorada", "Capa Roja", "Pantalón blanco", "Cinturón negro", "Botas negras"].map((item, idx) => (
                            <span key={idx} className="productos-implemento">{item}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ✅ Sección de productos similares */}
            <section className="productos-similares">
                <h2>DISFRACES SIMILARES</h2>
                <div className="productos-similares-contenedor">
                    {similares.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="productos-similar" onClick={() => handleProductClick(item)}>
                            <img src={item.img} alt={item.name} />
                            <p>{item.name.toUpperCase()}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Productos;