import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa"; 

// Componentes
import Card from "../Components/Card";
import CardContent from "../Components/CardContent";

// Carrusel
import { Carousel } from "react-responsive-carousel";
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

// Datos de productos
const products = [
    { name: "Chaqueta de Cuero", price: "$120", img: chaqueta },
    { name: "Camiseta Casual", price: "$30", img: camiseta },
    { name: "Jeans Slim Fit", price: "$50", img: jeans },
    { name: "Abrigo de Invierno", price: "$150", img: abrigo },
];

const newArrivals = [
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
        navigate("/productos", { state: { product } });
    };

    return (
        <div className="store-container">
            {/* Carrusel de productos principales */}
            <section className="carousel-section">
                <Carousel showThumbs={false} autoPlay infiniteLoop>
                    {products.map((item, index) => (
                        <div key={index} onClick={() => handleProductClick(item)}>
                            <img src={item.img} alt={item.name} className="carousel-image" />
                            <p className="carousel-text">{item.name} - {item.price}</p>
                        </div>
                    ))}
                </Carousel>
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
        </div>
    );
}
