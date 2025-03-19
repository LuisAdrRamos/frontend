import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "../styles/navbar.css";

const Navbar = ({ toggleSidebar }) => {
    return (
        <nav className="navbar  px-4">
            {/* 📌 Botón de menú en móviles */}
            <button className="menu-btn" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faBars} />
            </button>

            {/* 📌 Logo + Nombre */}
            <div className="navbar-logo">
                <img src="/logo.png" alt="Logo" />
                <span className="navbar-title">Megadisfraz</span>
            </div>

            {/* 📅 Meses del Año (solo en escritorio) */}
            <ul className="navbar-meses">
                {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((mes, index) => (
                    <li className="nav-item" key={index}>
                        <Link className="nav-link" to="/">{mes}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;
