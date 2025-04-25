import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Searches = () => {
    const location = useLocation();
    const [month, setMonth] = useState("");
    const [etiqueta, setEtiqueta] = useState("");

    // Obtener los parámetros "month" y "etiqueta" de la URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const selectedMonth = queryParams.get("month");
        const selectedEtiqueta = queryParams.get("etiqueta");

        setMonth(selectedMonth || ""); 
        setEtiqueta(selectedEtiqueta || ""); 
    }, [location]);

    return (
        <div className="searches-container">
            {month && <h1>Redirigido correctamente. Mes seleccionado: {month}</h1>}
            {etiqueta && <h1>Redirigido correctamente. Etiqueta seleccionada: {etiqueta}</h1>}
            {!month && !etiqueta && <h1>No se seleccionó ningún mes ni etiqueta.</h1>}
        </div>
    );
};

export default Searches;