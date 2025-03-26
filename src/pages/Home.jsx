import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Eventos from "./Eventos"

// Componentes
import Card from "../components/Card";
import CardContent from "../components/CardContent";

// Carrusel
import "react-responsive-carousel/lib/styles/carousel.min.css";

// Estilos
import "../styles/home.css";

// Importar imágenes desde assets
import chaqueta from "../assets/chaqueta.jpg";
import camiseta from "../assets/camiseta.jpg";
import jeans from "../assets/jeans.jpg";
import abrigo from "../assets/abrigo.jpg";
import zapatillas from "../assets/zapatillas.jpg";
import vestido from "../assets/vestido.jpg";
import sudadera from "../assets/sudadera.jpg";
import bolso from "../assets/bolso.jpg";
import Disfraces from "./Disfraces";

// Datos de productos
export const products = [
    { name: "Chaqueta de Cuero", price: "$120", img: chaqueta },
    { name: "Camiseta Casual", price: "$30", img: camiseta },
    { name: "Jeans Slim Fit", price: "$50", img: jeans },
    { name: "Abrigo de Invierno", price: "$150", img: abrigo },
];

export const newArrivals = [
    { name: "Zapatillas Deportivas", price: "$90", img: zapatillas },
    { name: "Vestido Elegante", price: "$75", img: vestido },
    { name: "Sudadera Oversize", price: "$40", img: sudadera },
    { name: "Bolso de Cuero", price: "$60", img: bolso },
    { name: "Chaqueta de Cuero", price: "$120", img: chaqueta },
    { name: "Camiseta Casual", price: "$30", img: camiseta },
    { name: "Jeans Slim Fit", price: "$50", img: jeans },
    { name: "Abrigo de Invierno", price: "$150", img: abrigo },
];

export default function MainPage() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleProductClick = (product) => {
        navigate(`/productos/${encodeURIComponent(product.name)}`);
    };

    return (
        <div className="store-container">
            {/* Carrusel de productos principales (Bootstrap) */}
            <section className="carousel-section" style={{ maxWidth: "80%", margin: "auto" }}>
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        {products.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="#carouselExampleIndicators"
                                data-bs-slide-to={index}
                                className={index === 0 ? "active" : ""}
                                aria-current={index === 0 ? "true" : "false"}
                                aria-label={`Slide ${index + 1}`}
                            ></button>
                        ))}
                    </div>
                    <div className="carousel-inner">
                        {products.map((item, index) => (
                            <div
                                key={index}
                                className={`carousel-item ${index === 0 ? "active" : ""}`}
                                onClick={() => handleProductClick(item)}
                            >
                                <img
                                    src={item.img}
                                    alt={item.name}
                                    className="carousel-image"
                                    style={{
                                        height: "500px",  // Ajusta la altura aquí
                                        width: "100%",     // Mantiene el ancho ajustado al contenedor
                                        objectFit: "scale-down" // Recorta la imagen para que encaje sin deformarse
                                    }}
                                />
                                <div className="carousel-caption d-none d-md-block">
                                    <p className="carousel-text" style={{ color: "black" }}>{item.name} - {item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </section>


            {/* Nuevas llegadas */}
            <section className="new-arrivals">
                <h2 className="titulo">Nuevas Llegadas ✨</h2>
                <div className="new-arrivals-container">
                    {newArrivals.map((item, index) => (
                        <Card key={index} className="new-arrival-card" onClick={() => handleProductClick(item)}>
                            <img src={item.img} alt={item.name} className="arrival-image" />
                            <CardContent>
                                <p>{item.name}</p>
                                <span>{item.price}</span>
                                <div className="card-icons">
                                    <FaHeart className="iconF" />
                                    <FaShoppingCart className="iconS" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>


            {/* Botón de información */}
            <div className="info-button-container">
                <button className="info-button" onClick={() => setShowModal(!showModal)}>?</button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-button" onClick={() => setShowModal(false)}>&times;</button>
                        <h2 className="modal-title">Tutorial de Uso</h2>
                        <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/uNlXIz23e28"
                            title="Tutorial"
                            frameBorder="0"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
            <Disfraces />
        </div>
    );
}