import React, { useState } from "react";

const BuscarEvento = ({ eventos }) => {
    const [searchCriteria, setSearchCriteria] = useState({
        mes: "",
        dia: "",
        nombre: ""
    });
    const [resultados, setResultados] = useState([]);

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
                (dia && evento.dia === dia) ||
                (nombre && evento.nombre.toLowerCase().includes(nombre.toLowerCase()))
            );
        });

        setResultados(filteredEventos);
    };

    return (
        <div>
            <h2>Buscar Evento</h2>
            <form onSubmit={handleSearch}>
                <div>
                    <label htmlFor="mes">Mes:</label>
                    <input
                        type="text"
                        id="mes"
                        name="mes"
                        value={searchCriteria.mes}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="dia">Día:</label>
                    <input
                        type="number"
                        id="dia"
                        name="dia"
                        value={searchCriteria.dia}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="nombre">Nombre del evento:</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={searchCriteria.nombre}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Buscar</button>
            </form>

            <h3>Resultados:</h3>
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