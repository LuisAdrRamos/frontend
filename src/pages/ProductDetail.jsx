import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetail.css";
import DisfracesContext from "../context/ProductosProvider";
import Mapa from "../components/mapa";

const ProductDetail = () => {
    const { obtenerDetalleDisfraz, disfraces } = useContext(DisfracesContext);
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatFestividad = (festividad) =>
        `${festividad.nombre} - ${festividad.dia} de ${festividad.mes}`;

    const ordenarFestividades = (festividades) => {
        const mesesOrden = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];
        return [...festividades].sort((a, b) => {
            const mesA = mesesOrden.indexOf(a.mes);
            const mesB = mesesOrden.indexOf(b.mes);
            return mesA !== mesB ? mesA - mesB : a.dia - b.dia;
        });
    };

    useEffect(() => {
        const cargarDetalle = async () => {
            try {
                setLoading(true);
                const disfraz = await obtenerDetalleDisfraz(id);
                if (disfraz?.festividades?.length) {
                    disfraz.festividades = ordenarFestividades(disfraz.festividades);
                }
                setProduct(disfraz ?? null);
            } catch {
                setError("Error al cargar los detalles del producto");
            } finally {
                setLoading(false);
            }
        };
        cargarDetalle();
    }, [id, obtenerDetalleDisfraz]);

    if (loading) return <div className="loading-message">Cargando detalles del producto...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!product) return <div className="producto-no-encontrado">Producto no encontrado</div>;

    const productImages = product.imagenes || [];
    const similares = disfraces.filter(item => item.id !== parseInt(id, 10));
    const handleProductClick = (item) => navigate(`/productos/${item.id}`);

    // Nuevos filtros:
    const disfracesMismaEtiqueta = similares.filter(item =>
        item.etiquetas?.some(et =>
            product.etiquetas?.some(pet => pet.id === et.id)
        )
    );

    const disfracesMismoEvento = similares.filter(item =>
        item.festividades?.some(ev =>
            product.festividades?.some(pev =>
                ev.nombre === pev.nombre && ev.dia === pev.dia && ev.mes === pev.mes
            )
        )
    );

    const disfracesMismoMes = similares.filter(item =>
        item.festividades?.some(ev =>
            product.festividades?.some(pev => ev.mes === pev.mes)
        )
    );

    return (
        <div className="product-detail-wrapper">
            <div className="parent-ProductDetail">
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
                                    <div className="carousel-image-wrapper">
                                        <img src={image} className="d-block w-100" alt={product.nombre} />
                                    </div>
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

                <div className="product-info">
                    <p><strong>Nombre:</strong> {product.nombre}</p>
                    <p><strong>Descripción:</strong> {product.descripcion || "No hay descripción disponible."}</p>

                    <p><strong>Evento:</strong></p>
                    {product.festividades?.length ? (
                        <ul className="festividades-list">
                            {product.festividades.map((f, i) => (
                                <li key={f.id || i}>{formatFestividad(f)}</li>
                            ))}
                        </ul>
                    ) : <p>Evento no disponible</p>}

                    <p><strong>Etiquetas:</strong></p>
                    <ul className="product-prendas">
                        {product.etiquetas?.length ? (
                            product.etiquetas.map((et) => (
                                <li key={et.id}>{et.nombre}</li>
                            ))
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
                {/* MISMA ETIQUETA */}
                <h2>Disfraces con las mismas etiquetas</h2>
                <div className="productos-similares-container">
                    <div className="productos-similares-lista">
                        {disfracesMismaEtiqueta.length > 0 ? (
                            disfracesMismaEtiqueta.slice(0, 6).map((item, idx) => (
                                <div key={idx} className="producto-similar" onClick={() => handleProductClick(item)}>
                                    <img src={item.imagenes[0]} alt={item.nombre} />
                                    <p>{item.nombre}</p>
                                </div>
                            ))
                        ) : (
                            <p>No existen disfraces que coincidan en etiquetas.</p>
                        )}
                    </div>
                </div>

                {/* MISMO EVENTO */}
                <h2>Disfraces de los mismo eventos</h2>
                <div className="productos-similares-container">
                    <div className="productos-similares-lista">
                        {disfracesMismoEvento.length > 0 ? (
                            disfracesMismoEvento.slice(0, 6).map((item, idx) => (
                                <div key={idx} className="producto-similar" onClick={() => handleProductClick(item)}>
                                    <img src={item.imagenes[0]} alt={item.nombre} />
                                    <p>{item.nombre}</p>
                                </div>
                            ))
                        ) : (
                            <p>No existen disfraces que coincidan en eventos.</p>
                        )}
                    </div>
                </div>

                {/* MISMO MES */}
                <h2>Disfraces del mismo mes</h2>
                <div className="productos-similares2-container">
                    <div className="productos-similares-lista">
                        {disfracesMismoMes.length > 0 ? (
                            disfracesMismoMes.slice(0, 6).map((item, idx) => (
                                <div key={idx} className="producto-similar" onClick={() => handleProductClick(item)}>
                                    <img src={item.imagenes[0]} alt={item.nombre} />
                                    <p>{item.nombre}</p>
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
