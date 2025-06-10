// src/pages/Searches.jsx
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DisfracesContext from "../context/ProductosProvider";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import ImageWithFallback from "../components/ImageWithFallback";
import "../styles/searches.css";

const Searches = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { disfraces = [] } = useContext(DisfracesContext);

    const [searchQuery, setSearchQuery] = useState("");
    const [month, setMonth] = useState("");
    const [etiqueta, setEtiqueta] = useState("");
    const [event, setEvent] = useState("");

    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const cleanMonthParam = (m) => m ? m.replace(/\|/g, "").trim() : "";

    useEffect(() => {
        const qp = new URLSearchParams(location.search);
        setSearchQuery(qp.get("query") || "");
        setMonth(cleanMonthParam(qp.get("month") || ""));
        setEtiqueta(qp.get("etiqueta") || "");
        setEvent(qp.get("event") || "");
    }, [location]);

    const disfracesFiltrados = disfraces.filter(d => {
        const nSearch = searchQuery.toLowerCase();
        const nMonth = month.toLowerCase();
        const nEtiqueta = etiqueta.toLowerCase();
        const nEvent = event.toLowerCase();

        return (
            (!searchQuery ||
                d.nombre.toLowerCase().includes(nSearch) ||
                d.descripcion?.toLowerCase().includes(nSearch)) &&
            (!month ||
                d.festividades?.some(f => f.mes.toLowerCase() === nMonth)) &&
            (!etiqueta ||
                d.etiquetas?.some(e => e.nombre.toLowerCase() === nEtiqueta)) &&
            (!event ||
                d.festividades?.some(f =>
                    f.nombre.toLowerCase().includes(nEvent)
                ))
        );
    });

    const ordenarPorMesMasReciente = (list) => {
        if (!list.length) return [];
        const mesAct = meses[new Date().getMonth()];
        const idxAct = meses.indexOf(mesAct);
        const mesesReord = [...meses.slice(idxAct), ...meses.slice(0, idxAct)].reverse();
        return [...list].sort((a, b) => {
            const getMax = (d) => {
                let m = -1;
                d.festividades?.forEach(f => {
                    const idx = mesesReord.indexOf(f.mes);
                    if (idx > m) m = idx;
                });
                return m;
            };
            return getMax(b) - getMax(a);
        });
    };

    const disfracesOrdenados = ordenarPorMesMasReciente(disfracesFiltrados);

    const handleProductClick = (d) => navigate(`/productos/${d.id}`);

    return (
        <div className="searches-container">
            <section className="filtered-disfraces">
                <h2 className="filtered-title">
                    {searchQuery && `Resultados para "${searchQuery}" `}
                    {month && ` Disfraces de ${month} `}
                    {etiqueta && ` Etiqueta: ${etiqueta} `}
                    {event && ` Evento: ${event}`}
                </h2>
                <div className="filtered-container">
                    {disfracesOrdenados.length ? (
                        disfracesOrdenados.map(d => (
                            <Card
                                key={d.id}
                                className="filtered-card"
                                onClick={() => handleProductClick(d)}
                            >
                                <ImageWithFallback
                                    imagenes={d.imagenes}
                                    alt={d.nombre}
                                    className="filtered-image"
                                />
                                <CardContent>
                                    <p>{d.nombre}</p>
                                    {d.festividades?.length > 0 && (
                                        <small>
                                            Festividades: {d.festividades.map(f => f.mes).join(", ")}
                                        </small>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="no-disfraces">
                            No se encontraron disfraces con los filtros aplicados
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Searches;
