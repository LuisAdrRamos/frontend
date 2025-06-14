// src/pages/ProductDetail.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetail.css";
import DisfracesContext from "../context/ProductosProvider";
import ImageWithFallback from "../components/ImageWithFallback";
import { normalizeImages } from "../utils/imageUtils";
import Mapa from "../components/mapa";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

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
            const ma = mesesOrd.indexOf(a.mes),
                mb = mesesOrd.indexOf(b.mes);
            return ma !== mb ? ma - mb : a.dia - b.dia;
        });
    };

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const d = await obtenerDetalleDisfraz(id);
                if (d?.festividades?.length) {
                    d.festividades = ordenarFestividades(d.festividades);
                }
                setProduct(d || null);
            } catch {
                setError("Error al cargar los detalles del producto");
            } finally {
                setLoading(false);
            }
        })();
    }, [id, obtenerDetalleDisfraz]);

    if (loading) return <div className="loading-message">Cargando detalles del producto...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!product) return <div className="producto-no-encontrado">Producto no encontrado</div>;

    // Normalizamos siempre a array
    const productImages = normalizeImages(product.imagenes);

    // Excluye del array `base` todos los IDs que aparezcan en `exclude`
    const excluirIds = (base, exclude) => {
        const setEx = new Set(exclude.map(x => x.id));
        return base.filter(item => !setEx.has(item.id));
    };

    // 1) Todos los disfraces excepto el actual
    const similares = disfraces.filter(i => i.id !== Number(id));

    // 2) Categorías
    const mismaEtiqueta = similares.filter(i =>
        i.etiquetas?.some(e => product.etiquetas?.some(pe => pe.id === e.id))
    );

    const mismoEventoRaw = similares.filter(i =>
        i.festividades?.some(ev =>
            product.festividades?.some(pf =>
                ev.nombre === pf.nombre && ev.dia === pf.dia && ev.mes === pf.mes
            )
        )
    );
    // excluimos los que ya están en 'mismaEtiqueta'
    const mismoEvento = excluirIds(mismoEventoRaw, mismaEtiqueta);

    const mismoMesRaw = similares.filter(i =>
        i.festividades?.some(ev =>
            product.festividades?.some(pf => ev.mes === pf.mes)
        )
    );
    // excluimos los que ya están en 'mismaEtiqueta' o 'mismoEvento'
    const mismoMes = excluirIds(
        excluirIds(mismoMesRaw, mismaEtiqueta),
        mismoEvento
    );

    const handleProductClick = (p) => navigate(`/productos/${p.id}`);

    return (
        <div className="product-detail-wrapper">
            <div className="parent-ProductDetail">
                {/* --- Carousel --- */}
                <div className="product-img">
                    <div id="carouselExampleIndicators" className="carousel slide w-100" data-bs-ride="carousel">
                        <div className="carousel-indicators">
                            {productImages.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    data-bs-target="#carouselExampleIndicators"
                                    data-bs-slide-to={idx}
                                    className={idx === 0 ? 'active' : ''}
                                    aria-current={idx === 0 ? 'true' : undefined}
                                    aria-label={`Slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                        <div className="carousel-inner">
                            {productImages.map((_, idx) => (
                                <div key={idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                                    <ImageWithFallback
                                        imagenes={product.imagenes}
                                        index={idx}
                                        alt={product.nombre}
                                        className="d-block w-100"
                                    />
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

                {/* --- Info del producto --- */}
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

            {/* --- Mapa --- */}
            <div className="product-mapa">
                <Mapa />
            </div>

            {/* --- Relacionados --- */}
            <div className="product-related">
                <h2 className="titulo">Disfraces con las mismas etiquetas</h2>
                <div className="productos-similares-container">
                    <div className="productos-similares-lista">
                        {mismaEtiqueta.length ? mismaEtiqueta.slice(0, 6).map((i, idx) => (
                            <div key={idx} className="producto-similar" onClick={() => handleProductClick(i)}>
                                <ImageWithFallback imagenes={i.imagenes} alt={i.nombre} className="d-block w-100" />
                                <p>{i.nombre}</p>
                            </div>
                        )) : (
                            <p>No existen disfraces que coincidan en etiquetas.</p>
                        )}
                    </div>
                </div>

                <h2 className="titulo">Disfraces de los mismos eventos</h2>
                <div className="productos-similares-container">
                    <div className="productos-similares-lista">
                        {mismoEvento.length ? mismoEvento.slice(0, 6).map((i, idx) => (
                            <div key={idx} className="producto-similar" onClick={() => handleProductClick(i)}>
                                <ImageWithFallback imagenes={i.imagenes} alt={i.nombre} className="d-block w-100" />
                                <p>{i.nombre}</p>
                            </div>
                        )) : (
                            <p>No existen disfraces que coincidan en eventos.</p>
                        )}
                    </div>
                </div>

                <h2 className="titulo">Disfraces del mismo mes</h2>
                <div className="productos-similares2-container">
                    <div className="productos-similares-lista">
                        {mismoMes.length ? mismoMes.slice(0, 6).map((i, idx) => (
                            <div key={idx} className="producto-similar" onClick={() => handleProductClick(i)}>
                                <ImageWithFallback imagenes={i.imagenes} alt={i.nombre} className="d-block w-100" />
                                <p>{i.nombre}</p>
                            </div>
                        )) : (
                            <p>No existen disfraces que coincidan en el mes.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
