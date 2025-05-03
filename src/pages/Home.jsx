import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import DisfracesContext from "../context/ProductosProvider"; // Importa el contexto
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/home.css";

export default function MainPage() {
    const navigate = useNavigate();
    const { disfraces = [] } = useContext(DisfracesContext); // ✅ Se asegura que `disfraces` esté inicializado

    // Obtener el mes actual
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const mesActual = meses[new Date().getMonth()];

    // Filtrar disfraces por el mes actual
    const disfracesFiltrados = disfraces.length > 0 ? disfraces.filter(disfraz => 
        disfraz.festividad && disfraz.festividad.mes === mesActual
    ) : [];

    const handleProductClick = (disfraz) => {
        navigate(`/productos/${disfraz.id}`);
    };

    return (
        <div className="store-container">
            {/* Carrusel de productos principales */}
            <section className="carousel-section" style={{ maxWidth: "80%", margin: "auto" }}>
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        {disfraces.map((_, index) => (
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
                        {disfraces.map((disfraz, index) => (
                            <div
                                key={disfraz.id}
                                className={`carousel-item ${index === 0 ? "active" : ""}`}
                                onClick={() => handleProductClick(disfraz)}
                            >
                                <img
                                    src={disfraz.imagenes[0]}
                                    alt={disfraz.nombre}
                                    className="carousel-image"
                                    style={{
                                        height: "500px",
                                        width: "100%",
                                        objectFit: "scale-down",
                                    }}
                                />
                                <div className="carousel-caption d-none d-md-block">
                                    <p className="carousel-text" style={{ color: "black" }}>
                                        {disfraz.nombre}
                                    </p>
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

            {/* Disfraces del mes */}
            <section className="new-arrivals">
                <h2 className="titulo">Disfraces de {mesActual}</h2>
                <div className="new-arrivals-container">
                    {disfracesFiltrados.length > 0 ? (
                        disfracesFiltrados.map((disfraz) => (
                            <Card key={disfraz.id} className="new-arrival-card" onClick={() => handleProductClick(disfraz)}>
                                <img src={disfraz.imagenes[0]} alt={disfraz.nombre} className="arrival-image" />
                                <CardContent>
                                    <p>{disfraz.nombre}</p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="no-disfraces">No hay disfraces disponibles para {mesActual}.</p>
                    )}
                </div>
            </section>

            {/* Todos los disfraces */}
            <section className="all-disfraces">
                <h2 className="all-title">Todos los Disfraces</h2>
                <div className="all-container">
                    {disfraces.length > 0 ? (
                        disfraces.map((disfraz) => (
                            <Card key={disfraz.id} className="all-card" onClick={() => handleProductClick(disfraz)}>
                                <img src={disfraz.imagenes[0]} alt={disfraz.nombre} className="all-image" />
                                <CardContent>
                                    <p>{disfraz.nombre}</p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="no-disfraces">Cargando disfraces...</p>
                    )}
                </div>
            </section>
        </div>
    );
}