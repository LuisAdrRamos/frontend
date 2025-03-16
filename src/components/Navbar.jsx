import React, { useEffect } from "react";
import { Link } from "react-router-dom"; 
import "../styles/navbar.css"; // Importamos los estilos

const Navbar = () => {
    useEffect(() => {
        // Forzar recarga de estilos
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/styles/navbar.css";
        document.head.appendChild(link);
    }, []);

    return (
        <nav className="navbar">
            {/* Logo + Nombre */}
            <div className="navbar-logo">
                <img src="/logo.png" alt="Logo" />
                <span className="navbar-title">Megadisfraz</span>
            </div>

            {/* Meses del Año */}
            <ul className="navbar-meses">
                {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((mes, index) => (
                    <li className="nav-item" key={index}>
                        <Link className="nav-link" to="/">{mes}</Link>
                    </li>
                ))}
            </ul>

            {/* Botón de Búsqueda */}
            <div className="navbar-search">
                <button className="search-btn">🔍</button>
            </div>
        </nav>
    );
};

export default Navbar;
