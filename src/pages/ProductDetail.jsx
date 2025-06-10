// src/pages/ProductDetail.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetail.css";
import DisfracesContext from "../context/ProductosProvider";
import ImageWithFallback from "../components/ImageWithFallback";
import { normalizeImages } from "../utils/imageUtils";
import Mapa from "../components/mapa";

const ProductDetail = () => {
    const { obtenerDetalleDisfraz, disfraces } = useContext(DisfracesContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatFestividad = (f) => `${f.nombre} - ${f.dia} de ${f.mes}`;
    const ordenarFestividades = (list) => {
        const mesesOrd = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        return [...list].sort((a, b) => {
            const ma = mesesOrd.indexOf(a.mes);
            const mb = mesesOrd.indexOf(b.mes);
            return ma !== mb ? ma - mb : a.dia - b.dia;
        });
    };

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const d = await obtenerDetalleDisfraz(id);
                if (d?.festividades?.length) {
                    d.festividades = ordenarFestividades(d.festividades);
                }
                setProduct(d ?? null);
            } catch {
                setError("Error al cargar los detalles del producto");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, obtenerDetalleDisfraz]);

    if (loading) return <div className="loading-message">Cargando detalles del producto...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!product) return <div className="producto-no-encontrado">Producto no encontrado</div>;

    // Normalizamos always a array
    const productImages = normalizeImages(product.imagenes);

    const similares = disfraces.filter(i => i.id !== Number(id));
    const handleProductClick = (i) => navigate(`/productos/${i.id}`);

    const disfracesMismaEtiqueta = similares.filter(i =>
        i.etiquetas?.some(e => product.etiquetas?.some(pe => pe.id === e.id))
    );
    const disfracesMismoEvento = similares.filter(i =>
        i.festividades?.some(ev =>
            product.festividades?.some(pf =>
                ev.nombre === pf.nombre && ev.dia === pf.dia && ev.mes === pf.mes
            )
        )
    );
    const disfracesMismoMes = similares.filter(i =>
        i.festividades?.some(ev =>
            product.festividades?.some(pf => ev.mes === pf.mes)
        )
    );

    return (
        <div className="product-detail-wrapper">
            <div className="parent-ProductDetail">
                <div className="product-img">
                    <div id="carouselExampleIndicators" className="carousel slide">
                        <div className="carousel-indicators">
                            {productImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    data-bs-target="#carouselExampleIndicators"
                                    data-bs-slide-to={idx}
                                    className={idx === 0 ? "active" : ""}
                                    aria-label={`Slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                        <div className="carousel-inner">
                            {productImages.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`carousel-item ${idx === 0 ? "active" : ""}`}
                                >
                                    <div className="carousel-image-wrapper">
                                        <ImageWithFallback
                                            imagenes={product.imagenes}
                                            index={idx}
                                            alt={product.nombre}
                                            className="d-block w-100"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {productImages.length > 1 && (
                            <>
                                <button
                                    className="carousel-control-prev"
                                    type="button"
                                    data-bs-target="#carouselExampleIndicators"
                                    data-bs-slide="prev"
                                >
                                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button
                                    className="carousel-control-next"
                                    type="button"
                                    data-bs-target="#carouselExampleIndicators"
                                    data-bs-slide="next"
                                >
                                    <span className="carousel-control-next-icon" aria-hidden="true" />
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="product-info">
                    <p><strong>Nombre:</strong> {product.nombre}</p>
                    <p><strong>Descripción:</strong> {product.descripcion || "No hay descripción disponible."}</p>

                    <p><strong>Evento:</strong></p>
                    {product.festividades?.length ? (
                        <ul className="festividades-list">
                            {product.festividades.map((f, i) => (
                                <li key={i}>{formatFestividad(f)}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>Evento no disponible</p>
                    )}

                    <p><strong>Etiquetas:</strong></p>
                    <ul className="product-prendas">
                        {product.etiquetas?.length ? (
                            product.etiquetas.map(et => <li key={et.id}>{et.nombre}</li>)
                        ) : (
                            <li>No hay etiquetas disponibles.</li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="product-mapa">
                <Mapa />
            </div>

            <div className="product-related">
                {/* Misma etiqueta */}
                <h2 className="titulo">Disfraces con las mismas etiquetas</h2>
                <div className="productos-similares-container">
                    <div className="productos-similares-lista">
                        {disfracesMismaEtiqueta.length ? (
                            disfracesMismaEtiqueta.slice(0, 6).map((i, idx) => (
                                <div key={idx} className="producto-similar" onClick={() => handleProductClick(i)}>
                                    <ImageWithFallback
                                        imagenes={i.imagenes}
                                        alt={i.nombre}
                                        className="d-block w-100"
                                    />
                                    <p>{i.nombre}</p>
                                </div>
                            ))
                        ) : (
                            <p>No existen disfraces que coincidan en etiquetas.</p>
                        )}
                    </div>
                </div>

                {/* Mismo evento */}
                <h2 className="titulo">Disfraces de los mismos eventos</h2>
                <div className="productos-similares-container">
                    <div className="productos-similares-lista">
                        {disfracesMismoEvento.length ? (
                            disfracesMismoEvento.slice(0, 6).map((i, idx) => (
                                <div key={idx} className="producto-similar" onClick={() => handleProductClick(i)}>
                                    <ImageWithFallback
                                        imagenes={i.imagenes}
                                        alt={i.nombre}
                                        className="d-block w-100"
                                    />
                                    <p>{i.nombre}</p>
                                </div>
                            ))
                        ) : (
                            <p>No existen disfraces que coincidan en eventos.</p>
                        )}
                    </div>
                </div>

                {/* Mismo mes */}
                <h2 className="titulo">Disfraces del mismo mes</h2>
                <div className="productos-similares2-container">
                    <div className="productos-similares-lista">
                        {disfracesMismoMes.length ? (
                            disfracesMismoMes.slice(0, 6).map((i, idx) => (
                                <div key={idx} className="producto-similar" onClick={() => handleProductClick(i)}>
                                    <ImageWithFallback
                                        imagenes={i.imagenes}
                                        alt={i.nombre}
                                        className="d-block w-100"
                                    />
                                    <p>{i.nombre}</p>
                                </div>
                            ))
                        ) : (
                            <p>No existen disfraces que coincidan en el mes.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
