import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DisfracesContext from "../context/ProductosProvider";
import Card from "../components/Card";
import CardContent from "../components/CardContent";
import "../styles/searches.css";

const Searches = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { disfraces = [] } = useContext(DisfracesContext);

    // Estados para filtros dinámicos
    const [searchQuery, setSearchQuery] = useState("");
    const [month, setMonth] = useState("");
    const [etiqueta, setEtiqueta] = useState("");
    const [event, setEvent] = useState("");

    // Definición de meses para ordenación
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Función para limpiar el parámetro de mes (eliminar | y espacios)
    const cleanMonthParam = (monthParam) => {
        if (!monthParam) return "";
        return monthParam.replace(/\|/g, "").trim();
    };

    // Obtener los parámetros de la URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const rawMonth = queryParams.get("month") || "";

        setSearchQuery(queryParams.get("query") || "");
        setMonth(cleanMonthParam(rawMonth)); // Limpiamos el parámetro month
        setEtiqueta(queryParams.get("etiqueta") || "");
        setEvent(queryParams.get("event") || "");

        console.log("🔍 Parámetros de búsqueda (limpios):", {
            query: queryParams.get("query"),
            month: cleanMonthParam(rawMonth),
            etiqueta: queryParams.get("etiqueta"),
            event: queryParams.get("event"),
        });
    }, [location]);

    // ✅ Filtros combinados: Se aplican TODOS los seleccionados
    const disfracesFiltrados = disfraces.filter(disfraz => {
        // Normalizamos las comparaciones
        const normalizedMonth = month.toLowerCase();
        const normalizedEtiqueta = etiqueta.toLowerCase();
        const normalizedEvent = event.toLowerCase();
        const normalizedSearch = searchQuery.toLowerCase();

        return (
            // Filtro por búsqueda
            (!searchQuery ||
                disfraz.nombre.toLowerCase().includes(normalizedSearch) ||
                (disfraz.descripcion && disfraz.descripcion.toLowerCase().includes(normalizedSearch))) &&

            // Filtro por mes (comparación insensible a mayúsculas/minúsculas)
            (!month ||
                (disfraz.festividades &&
                    disfraz.festividades.some(f =>
                        f && f.mes && f.mes.toLowerCase() === normalizedMonth))) &&

            // Filtro por etiqueta
            (!etiqueta ||
                (disfraz.etiquetas &&
                    disfraz.etiquetas.some(e =>
                        e && e.nombre && e.nombre.toLowerCase() === normalizedEtiqueta))) &&

            // Filtro por evento
            (!event ||
                (disfraz.festividades &&
                    disfraz.festividades.some(f =>
                        f && f.nombre && f.nombre.toLowerCase().includes(normalizedEvent)))
            )
        );
    });

    // Función para ordenar por mes más cercano (similar a home.jsx)
    const ordenarPorMesMasReciente = (disfraces) => {
        if (!disfraces || disfraces.length === 0) return [];

        const mesActual = meses[new Date().getMonth()];
        const mesActualIndex = meses.indexOf(mesActual);

        // Reordenar meses para que el actual sea primero
        const mesesReordenados = [
            ...meses.slice(mesActualIndex),
            ...meses.slice(0, mesActualIndex)
        ].reverse();

        return [...disfraces].sort((a, b) => {
            if (!a.festividades || !b.festividades) return 0;

            // Obtener el mes más reciente de cada disfraz
            const getMesMasReciente = (disfraz) => {
                let maxMesIndex = -1;
                disfraz.festividades.forEach(festividad => {
                    if (!festividad || !festividad.mes) return;
                    const index = mesesReordenados.indexOf(festividad.mes);
                    if (index > maxMesIndex) maxMesIndex = index;
                });
                return maxMesIndex;
            };

            return getMesMasReciente(b) - getMesMasReciente(a);
        });
    };

    const disfracesOrdenados = ordenarPorMesMasReciente(disfracesFiltrados);

    const handleProductClick = (disfraz) => {
        navigate(`/productos/${disfraz.id}`);
    };

    return (
        <div className="searches-container">
            <section className="filtered-disfraces">
                <h2 className="filtered-title">
                    {searchQuery && `Resultados para "${searchQuery}"`}
                    {month && ` Disfraces de ${month}`}
                    {etiqueta && ` Etiqueta: ${etiqueta}`}
                    {event && ` Evento: ${event}`}
                </h2>

                <div className="filtered-container">
                    {disfracesOrdenados.length > 0 ? (
                        disfracesOrdenados.map((disfraz) => (
                            <Card key={disfraz.id} className="filtered-card" onClick={() => handleProductClick(disfraz)}>
                                <img
                                    src={disfraz.imagenes?.[0] || '/placeholder-image.jpg'}
                                    alt={disfraz.nombre}
                                    className="filtered-image"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg';
                                    }}
                                />
                                <CardContent>
                                    <p>{disfraz.nombre}</p>
                                    {disfraz.festividades?.length > 0 && (
                                        <small>Festividades: {disfraz.festividades.map(f => f.mes).join(", ")}</small>
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