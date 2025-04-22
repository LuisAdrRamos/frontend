import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Productos.css";  
import DisfracesContext from "../context/ProductosProvider";

const Productos = () => {
    const { id } = useParams(); // Obtiene el ID del disfraz desde la URL
    const navigate = useNavigate();
    const { disfraces } = useContext(DisfracesContext); // Obtén los disfraces desde el contexto
    const [index, setIndex] = useState(0);

    // Encuentra el disfraz actual por su ID
    const product = disfraces.find(item => item.id === parseInt(id, 10)); // Ahora busca por ID (aseguramos que sea número)

    if (!product) {
        return <div className="productos-container"><h2>Producto no encontrado</h2></div>;
    }

    const productImages = product.imagenes || []; // Usar imágenes del backend (asegura que sea un arreglo)

    // Filtrar productos similares
    const similares = disfraces.filter(item => item.id !== product.id); // Excluye el disfraz actual comparando IDs

    // Redirigir al nuevo producto seleccionado
    const handleProductClick = (product) => {
        navigate(`/productos/${product.id}`); // Redirige usando ID
    };

    // Mover a la siguiente imagen del carrusel
    const nextSlide = () => {
        setIndex((prevIndex) => (prevIndex + 1) % productImages.length);
    };

    // Mover a la imagen anterior del carrusel
    const prevSlide = () => {
        setIndex((prevIndex) => (prevIndex - 1 + productImages.length) % productImages.length);
    };

    return (
        <div className="productos-container">
            <section className="productos-section">
                <h2 className="productos-titulo">{product.nombre}</h2>

                {/* Carrusel de imágenes */}
                {productImages.length > 0 ? (
                    <>
                        <div className="productos-carousel">
                            <button onClick={prevSlide}>&#9665;</button>
                            <img src={productImages[index]} alt={`Imagen ${index + 1}`} />
                            <button onClick={nextSlide}>&#9655;</button>
                        </div>

                        <div className="productos-indicadores">
                            {productImages.map((_, i) => (
                                <span
                                    key={i}
                                    className={`productos-indicador ${i === index ? "activo" : ""}`}
                                ></span>
                            ))}
                        </div>
                    </>
                ) : (
                    <img src={product.imagenes[0]} alt={product.nombre} />
                )}

                <div className="productos-detalles">
                    <p><strong>Nombre:</strong> {product.nombre}</p>
                    <p><strong>Precio:</strong> ${product.precio}</p>
                    <p><strong>Descripción:</strong> {product.descripcion || "No hay descripción disponible."}</p>
                </div>
            </section>

            {/* Sección de productos similares */}
            <section className="productos-similares">
                <h2>Disfraces Similares</h2>
                <div className="productos-similares-contenedor">
                    {similares.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="productos-similar" onClick={() => handleProductClick(item)}>
                            <img src={item.imagenes[0]} alt={item.nombre} />
                            <p>{item.nombre.toUpperCase()}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Productos;
