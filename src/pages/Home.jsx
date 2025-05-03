import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import DisfracesContext from "../context/ProductosProvider";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/home.css";

export default function MainPage() {
    const navigate = useNavigate();
    const { disfraces = [] } = useContext(DisfracesContext);

    // Obtener el mes actual
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const mesActual = meses[new Date().getMonth()];

    // Función para ordenar disfraces por mes más reciente
    const ordenarPorMesMasReciente = (disfraces) => {
        const mesesOrden = [...meses];
        const mesActualIndex = mesesOrden.indexOf(mesActual);
        
        // Reordenar el array de meses para que el actual sea el primero
        const mesesReordenados = [
            ...mesesOrden.slice(mesActualIndex),
            ...mesesOrden.slice(0, mesActualIndex)
        ].reverse();

        return [...disfraces].sort((a, b) => {
            if (!a.festividades || !b.festividades) return 0;
            
            // Obtener el mes más reciente de cada disfraz
            const getMesMasReciente = (disfraz) => {
                let maxMesIndex = -1;
                disfraz.festividades.forEach(festividad => {
                    const index = mesesReordenados.indexOf(festividad.mes);
                    if (index > maxMesIndex) maxMesIndex = index;
                });
                return maxMesIndex;
            };

            return getMesMasReciente(b) - getMesMasReciente(a);
        });
    };

    // Función para ordenar disfraces por día del mes actual
    const ordenarPorDiaDelMes = (disfraces) => {
        return [...disfraces].sort((a, b) => {
            if (!a.festividades || !b.festividades) return 0;
            
            // Obtener el día más cercano para el mes actual
            const getDiaMasCercano = (disfraz) => {
                const festividadesMesActual = disfraz.festividades.filter(
                    f => f.mes === mesActual
                );
                if (festividadesMesActual.length === 0) return Infinity;
                return Math.min(...festividadesMesActual.map(f => f.dia));
            };

            return getDiaMasCercano(a) - getDiaMasCercano(b);
        });
    };

    // Filtrar y ordenar disfraces por el mes actual
    const disfracesFiltrados = disfraces.length > 0 
        ? ordenarPorDiaDelMes(
            disfraces.filter(disfraz => 
                disfraz.festividades && disfraz.festividades.some(
                    festividad => festividad.mes === mesActual
                )
            )
        ) 
        : [];

    // Ordenar todos los disfraces por mes más reciente
    const disfracesOrdenados = ordenarPorMesMasReciente(disfraces);

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
                                    src={disfraz.imagenes?.[0] || '/placeholder-image.jpg'}
                                    alt={disfraz.nombre}
                                    className="carousel-image"
                                    style={{
                                        height: "500px",
                                        width: "100%",
                                        objectFit: "scale-down",
                                    }}
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg';
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

            {/* Disfraces del mes - Ordenados por día */}
            <section className="new-arrivals">
                <h2 className="titulo">Disfraces de {mesActual}</h2>
                <div className="new-arrivals-container">
                    {disfracesFiltrados.length > 0 ? (
                        disfracesFiltrados.map((disfraz) => (
                            <Card key={disfraz.id} className="new-arrival-card" onClick={() => handleProductClick(disfraz)}>
                                <img 
                                    src={disfraz.imagenes?.[0] || '/placeholder-image.jpg'} 
                                    alt={disfraz.nombre} 
                                    className="arrival-image"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg';
                                    }}
                                />
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

            {/* Todos los disfraces - Ordenados por mes más reciente */}
            <section className="all-disfraces">
                <h2 className="all-title">Todos los Disfraces</h2>
                <div className="all-container">
                    {disfracesOrdenados.length > 0 ? (
                        disfracesOrdenados.map((disfraz) => {
                            // Encontrar la festividad más reciente para mostrar
                            const festividadReciente = disfraz.festividades?.reduce((prev, current) => {
                                const prevIndex = meses.indexOf(prev.mes);
                                const currentIndex = meses.indexOf(current.mes);
                                return currentIndex > prevIndex ? current : prev;
                            }, {mes: "Enero", dia: 1});

                            return (
                                <Card key={disfraz.id} className="all-card" onClick={() => handleProductClick(disfraz)}>
                                    <img 
                                        src={disfraz.imagenes?.[0] || '/placeholder-image.jpg'} 
                                        alt={disfraz.nombre} 
                                        className="all-image"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-image.jpg';
                                        }}
                                    />
                                    <CardContent>
                                        <p>{disfraz.nombre}</p>
                                    </CardContent>
                                </Card>
                            );
                        }) 
                    ) : (
                        <p className="no-disfraces">Cargando disfraces...</p>
                    )}
                </div>
            </section>
        </div>
    );
}