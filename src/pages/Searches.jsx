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

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setSearchQuery(queryParams.get("query") || "");
        setMonth(queryParams.get("month") || "");
        setEtiqueta(queryParams.get("etiqueta") || "");
        setEvent(queryParams.get("event") || "");

        console.log("🔎 Parámetros de búsqueda:", {
            query: queryParams.get("query"),
            month: queryParams.get("month"),
            etiqueta: queryParams.get("etiqueta"),
            event: queryParams.get("event"),
        });
    }, [location]);

    // ✅ Filtros combinados: Se aplican TODOS los seleccionados
    const disfracesFiltrados = disfraces.filter(disfraz => {
        return (
            (!searchQuery || disfraz.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || disfraz.descripcion.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (!month || (disfraz.festividad && disfraz.festividad.mes === month)) &&
            (!etiqueta || disfraz.etiquetas.some(e => e.nombre === etiqueta)) &&
            (!event || (disfraz.festividad && disfraz.festividad.nombre.toLowerCase().includes(event.toLowerCase())))
        );
    });

    // ✅ Navegar sin eliminar los filtros anteriores
    const handleEtiquetaClick = (etiqueta) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set("etiqueta", etiqueta); // ✅ Agrega la etiqueta sin borrar los otros filtros
        navigate(`/searches?${queryParams.toString()}`);
    };

    const handleProductClick = (disfraz) => {
        navigate(`/productos/${disfraz.id}`);
    };

    return (
        <div className="searches-container">
            <h2 className="titulo">Resultados de la búsqueda</h2>

            <section className="filtered-disfraces">
                <h2 className="filtered-title">
                    {searchQuery ? `Resultados para "${searchQuery}"` : ""}
                    {month ? `Disfraces de ${month}` : ""}
                    {etiqueta ? `Disfraces con etiqueta: ${etiqueta}` : ""}
                    {event ? `Disfraces para el evento: ${event}` : ""}
                </h2>

                <div className="filtered-container">
                    {disfracesFiltrados.length > 0 ? (
                        disfracesFiltrados.map((disfraz) => (
                            <Card key={disfraz.id} className="filtered-card" onClick={() => handleProductClick(disfraz)}>
                                <img src={disfraz.imagenes[0]} alt={disfraz.nombre} className="filtered-image" />
                                <CardContent>
                                    <p>{disfraz.nombre}</p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="no-disfraces">No hay disfraces disponibles según el criterio seleccionado.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Searches;
