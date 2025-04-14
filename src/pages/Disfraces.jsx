import React, { useState } from "react";
import CrearDisfraz from "../components/CrearDisfraz";
import ActualizarDisfraz from "../components/ActualizarDisfraz";
import BuscarDisfraz from "../components/BuscarDisfraz";
import EliminarDisfraces from "../components/EliminarDisfraces";

const disfracesIniciales = [
    {
        nombre: "Disfraz de Vampiro",
        talla: "M",
        calidad: "Alta",
        categoria: "Terror",
        precio: 50,
        festividad: "Halloween",
        descripcion: "Un disfraz perfecto para Halloween.",
        imagen: null // Puedes usar una imagen real si lo deseas
    },
    {
        nombre: "Disfraz de Pirata",
        talla: "L",
        calidad: "Media",
        categoria: "Aventura",
        precio: 40,
        festividad: "Carnaval",
        descripcion: "Disfraz de pirata con sombrero y espada.",
        imagen: null
    },
    {
        nombre: "Disfraz de Princesa",
        talla: "S",
        calidad: "Alta",
        categoria: "Fantasía",
        precio: 60,
        festividad: "Fiesta de cumpleaños",
        descripcion: "Un hermoso disfraz de princesa con corona incluida.",
        imagen: null
    }
];

const Disfraces = () => {
    const [disfraces, setDisfraces] = useState(disfracesIniciales);
    const [moduloActivo, setModuloActivo] = useState(null);

    const handleActualizarDisfraces = (nuevosDisfraces) => {
        setDisfraces(nuevosDisfraces);
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">Gestión de Disfraces</h1>
            <div className="admin-buttons-container">
                <button className="admin-button button-crear" onClick={() => setModuloActivo("crear")}>Crear Disfraz</button>
                <button className="admin-button button-actualizar" onClick={() => setModuloActivo("editar")}>Editar Disfraz</button>
            </div>

            <div className="admin-module-container" style={{ marginTop: "20px" }}>
                {moduloActivo === "crear" && <CrearDisfraz />}
                {moduloActivo === "editar" && <ActualizarDisfraz />}
            </div>
        </div>
    );
};

export default Disfraces;