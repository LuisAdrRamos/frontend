import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "../styles/navbar.css";

const Navbar = ({ toggleSidebar }) => {
    const [autenticado, setAutenticado] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setAutenticado(!!token);
    }, []);

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("tipoUsuario");
        setAutenticado(false);
        navigate("/");
        window.location.reload(); // fuerza recarga si deseas limpiar estado global
    };

    return (
        <nav className="navbar px-4">
            <button className="menu-btn" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faBars} />
            </button>

            <Link to="/" className="navbar-logo">
                <img src="/logo.png" alt="Logo" />
                <span className="navbar-title">Megadisfraz</span>
            </Link>

            <ul className="navbar-meses">
                {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((mes, index) => (
                    <li className="nav-item" key={index}>
                        <Link className="nav-link" to="/">{mes}</Link>
                    </li>
                ))}
            </ul>
            <div className="navbar-auth">
                {!autenticado ? (
                    <Link to="/login" className="icon-btn login-icon" title="Iniciar Sesión">
                        <FontAwesomeIcon icon={faSignInAlt} />
                    </Link>
                ) : (
                    <>
                        <Link to="/perfil" className="icon-btn profile-icon" title="Perfil">
                            <FontAwesomeIcon icon={faUser} />
                        </Link>
                        <button className="icon-btn logout-icon" onClick={cerrarSesion} title="Cerrar Sesión">
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </button>
                    </>
                )}
            </div>

        </nav>
    );
};

export default Navbar;
