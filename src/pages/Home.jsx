import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import DisfracesContext from "../context/ProductosProvider";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import ImageWithFallback from "../components/ImageWithFallback";
import Mapa from "../components/mapa";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

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

    // Ordenar por mes más reciente
    const ordenarPorMesMasReciente = (disfracesList) => {
        const mesesOrden = [...meses];
        const mesActualIndex = mesesOrden.indexOf(mesActual);
        const mesesReordenados = [
            ...mesesOrden.slice(mesActualIndex),
            ...mesesOrden.slice(0, mesActualIndex)
        ].reverse();

        return [...disfracesList].sort((a, b) => {
            if (!a.festividades || !b.festividades) return 0;
            const getMesRec = (d) => {
                let max = -1;
                d.festividades.forEach(f => {
                    const idx = mesesReordenados.indexOf(f.mes);
                    if (idx > max) max = idx;
                });
                return max;
            };
            return getMesRec(b) - getMesRec(a);
        });
    };

    // Ordenar por día del mes actual
    const ordenarPorDiaDelMes = (disfracesList) => {
        return [...disfracesList].sort((a, b) => {
            if (!a.festividades || !b.festividades) return 0;
            const getDiaCercano = (d) => {
                const festMes = d.festividades.filter(f => f.mes === mesActual);
                if (!festMes.length) return Infinity;
                return Math.min(...festMes.map(f => f.dia));
            };
            return getDiaCercano(a) - getDiaCercano(b);
        });
    };

    // Filtrar disfraces del mes actual y ordenar por día
    const disfracesFiltrados = disfraces.length
        ? ordenarPorDiaDelMes(
            disfraces.filter(d =>
                d.festividades?.some(f => f.mes === mesActual)
            )
        )
        : [];

    // Todos los disfraces ordenados por mes más reciente
    const disfracesOrdenados = ordenarPorMesMasReciente(disfraces);

    const handleProductClick = (disfraz) => {
        navigate(`/productos/${disfraz.id}`);
    };

    return (
        <div className="store-container">
            {/* Carrusel personalizado */}
            <section className="carousel-section" style={{ maxWidth: "90%", margin: "auto" }}>
                <div id="carouselExampleCaptions" className="carousel slide w-100 " data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        {disfraces.map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                data-bs-target="#carouselExampleCaptions"
                                data-bs-slide-to={i}
                                className={i === 0 ? "active" : ""}
                                aria-current={i === 0 ? "true" : "false"}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                    <div className="carousel-inner">
                        {disfraces.map((d, i) => (
                            <div
                                key={d.id}
                                className={`carousel-item ${i === 0 ? "active" : ""}`}
                                onClick={() => handleProductClick(d)}
                                style={{ cursor: "pointer" }}
                            >
                                <ImageWithFallback
                                    imagenes={d.imagenes}
                                    alt={d.nombre}
                                    className="d-block w-100"
                                    style={{ height: "500px", objectFit: "cover" }}
                                />
                                <div className="carousel-caption d-none d-md-block">
                                    <h5>{d.nombre}</h5>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true" />
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#carouselExampleCaptions"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true" />
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </section>

            {/* Disfraces del mes */}
            <section className="new-arrivals">
                <h2 className="titulo">Disfraces de {mesActual}</h2>
                <div className="new-arrivals-container">
                    {disfracesFiltrados.length ? (
                        disfracesFiltrados.map(d => (
                            <Card
                                key={d.id}
                                className="new-arrival-card"
                                onClick={() => handleProductClick(d)}
                            >
                                <ImageWithFallback
                                    imagenes={d.imagenes}
                                    alt={d.nombre}
                                    className="arrival-image"
                                />
                                <CardContent>
                                    <p>{d.nombre}</p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="no-disfraces">
                            No hay disfraces disponibles para {mesActual}.
                        </p>
                    )}
                </div>
            </section>

            {/* Mapa */}
            <Mapa />

            {/* Todos los disfraces */}
            <section className="all-disfraces">
                <h2 className="all-title">Todos los Disfraces</h2>
                <div className="all-container">
                    {disfracesOrdenados.length ? (
                        disfracesOrdenados.map(d => {
                            const festReciente = d.festividades?.reduce((prev, cur) => {
                                const idxPrev = meses.indexOf(prev.mes);
                                const idxCur = meses.indexOf(cur.mes);
                                return idxCur > idxPrev ? cur : prev;
                            }, { mes: "Enero", dia: 1 });
                            return (
                                <Card
                                    key={d.id}
                                    className="all-card"
                                    onClick={() => handleProductClick(d)}
                                >
                                    <ImageWithFallback
                                        imagenes={d.imagenes}
                                        alt={d.nombre}
                                        className="all-image"
                                    />
                                    <CardContent>
                                        <p>{d.nombre}</p>
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