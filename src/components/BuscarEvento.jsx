import React, { useState, useEffect } from "react";

const BuscarEvento = () => {
    const [searchCriteria, setSearchCriteria] = useState({
        mes: "",
        dia: "",
        nombre: ""
    });
    const [eventos, setEventos] = useState([]);
    const [resultados, setResultados] = useState([]);

    
    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/festividades`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}` 
                    }
                });

                if (!response.ok) {
                    throw new Error("Error al obtener los eventos");
                }

                const data = await response.json();
                setEventos(data);
            } catch (error) {
                console.error("Error al cargar los eventos:", error);
            }
        };

        fetchEventos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchCriteria({
            ...searchCriteria,
            [name]: value
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const { mes, dia, nombre } = searchCriteria;

        const filteredEventos = eventos.filter((evento) => {
            return (
                (mes && evento.mes === mes) ||
                (dia && evento.dia === parseInt(dia)) ||
                (nombre && evento.nombre.toLowerCase().includes(nombre.toLowerCase()))
            );
        });

        setResultados(filteredEventos);
    };

    return (
        <div className="form-container">
            <h2 className="tittle-buscarev">Buscar Evento</h2>
            <form onSubmit={handleSearch} className="form-content">
                <div className="form-group1">
                    <label htmlFor="mes">Mes:</label>
                    <input
                        type="text"
                        id="mes"
                        name="mes"
                        className="form-input3"
                        value={searchCriteria.mes}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group1">
                    <label htmlFor="dia">Día:</label>
                    <input
                        type="number"
                        id="dia"
                        name="dia"
                        className="form-input3"
                        value={searchCriteria.dia}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group1">
                    <label htmlFor="nombre">Nombre del evento:</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        className="form-input3"
                        value={searchCriteria.nombre}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="form-button">Buscar</button>
            </form>

            <h3 className="tittle-resultadoev">Resultados:</h3>
            <ul>
                {resultados.length > 0 ? (
                    resultados.map((evento, index) => (
                        <li key={index}>
                            {evento.nombre} - {evento.mes}/{evento.dia}
                        </li>
                    ))
                ) : (
                    <p>No se encontraron eventos.</p>
                )}
            </ul>
        </div>
    );
};

export default BuscarEvento;