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
    const mesActual = meses[new Date().getMonth()];

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

    // Función para ordenar disfraces por proximidad de mes
    const ordenarPorMesMasReciente = (disfraces) => {
        const mesesOrden = [...meses];
        const mesActualIndex = mesesOrden.indexOf(mesActual);
        
        // Reordenar meses para que el actual sea primero
        const mesesReordenados = [
            ...mesesOrden.slice(mesActualIndex),
            ...mesesOrden.slice(0, mesActualIndex)
        ];

        return [...disfraces].sort((a, b) => {
            // Si no hay festividades, van al final
            if (!a.festividades || a.festividades.length === 0) return 1;
            if (!b.festividades || b.festividades.length === 0) return -1;
            
            // Obtener el índice del mes más cercano para cada disfraz
            const getMesMasCercano = (disfraz) => {
                let minIndex = Infinity;
                disfraz.festividades.forEach(festividad => {
                    const index = mesesReordenados.indexOf(festividad.mes);
                    if (index !== -1 && index < minIndex) minIndex = index;
                });
                return minIndex;
            };

            const indexA = getMesMasCercano(a);
            const indexB = getMesMasCercano(b);
            
            return indexA - indexB;
        });
    };

    // ✅ Filtros combinados: Se aplican TODOS los seleccionados
    const disfracesFiltrados = disfraces.filter(disfraz => {
        const cumpleBusqueda = !searchQuery || 
            disfraz.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
            disfraz.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
        
        const cumpleMes = !month || 
            (disfraz.festividades && 
             disfraz.festividades.some(f => f.mes === month));
        
        const cumpleEtiqueta = !etiqueta || 
            (disfraz.etiquetas && 
             disfraz.etiquetas.some(e => e.nombre === etiqueta));
        
        const cumpleEvento = !event || 
            (disfraz.festividades && 
             disfraz.festividades.some(f => 
                 f.nombre.toLowerCase().includes(event.toLowerCase())));

        return cumpleBusqueda && cumpleMes && cumpleEtiqueta && cumpleEvento;
    });

    // Ordenar los disfraces filtrados
    const disfracesOrdenados = ordenarPorMesMasReciente(disfracesFiltrados);

    // ✅ Navegar sin eliminar los filtros anteriores
    const handleEtiquetaClick = (etiqueta) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set("etiqueta", etiqueta);
        navigate(`/searches?${queryParams.toString()}`);
    };

    const handleProductClick = (disfraz) => {
        navigate(`/productos/${disfraz.id}`);
    };

    // Función para obtener las festividades únicas de un disfraz
    const getFestividadesUnicas = (festividades) => {
        if (!festividades || festividades.length === 0) return [];
        
        // Agrupar por mes y nombre para evitar duplicados
        const unicas = [];
        const vistas = new Set();
        
        festividades.forEach(f => {
            const clave = `${f.mes}-${f.nombre}`;
            if (!vistas.has(clave)) {
                vistas.add(clave);
                unicas.push(f);
            }
        });
        
        return unicas;
    };

    return (
        <div className="searches-container">
            <h2 className="titulo">Resultados de la búsqueda</h2>

            <section className="filtered-disfraces">
                <h2 className="filtered-title">
                    {searchQuery && `Resultados para "${searchQuery}"`}
                    {month && ` | Disfraces de ${month}`}
                    {etiqueta && ` | Etiqueta: ${etiqueta}`}
                    {event && ` | Evento: ${event}`}
                </h2>

                <div className="filtered-container">
                    {disfracesOrdenados.length > 0 ? (
                        disfracesOrdenados.map((disfraz) => {
                            const festividadesUnicas = getFestividadesUnicas(disfraz.festividades);
                            
                            return (
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
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <p className="no-disfraces">No hay disfraces disponibles según el criterio seleccionado.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Searches;