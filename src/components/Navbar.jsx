import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faSignInAlt, faSignOutAlt, faCog, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import "../styles/navbar.css";

const Navbar = ({ toggleSidebar }) => {
    const [autenticado, setAutenticado] = useState(false);
    const [tipoUsuario, setTipoUsuario] = useState(null); // Estado para el tipo de usuario
    const [showAdminMenu, setShowAdminMenu] = useState(false); // Control de visibilidad del menú de admin
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const usuarioTipo = localStorage.getItem("tipoUsuario"); // Obtenemos el tipo de usuario
        setAutenticado(!!token);
        setTipoUsuario(usuarioTipo); // Guardamos el tipo de usuario en el estado
    }, []);

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("tipoUsuario");
        setAutenticado(false);
        setTipoUsuario(null); // Limpiamos el tipo de usuario al cerrar sesión
        navigate("/");
        window.location.reload(); // fuerza recarga si deseas limpiar estado global
    };

    const toggleAdminMenu = () => {
        setShowAdminMenu(!showAdminMenu); // Toggle para mostrar/ocultar el menú
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
                        {tipoUsuario === "admin" || tipoUsuario === "moderador" ? (
                            <div className="admin-menu-container">
                                <button 
                                    className="icon-btn admin-icon" 
                                    onClick={toggleAdminMenu} 
                                    title="Administrador"
                                >
                                    <FontAwesomeIcon icon={faCog} /> <FontAwesomeIcon icon={faChevronDown} />
                                </button>
                                {showAdminMenu && (
                                    <div className="admin-menu">
                                        {/* Solo los administradores pueden ver el enlace de Administradores */}
                                        {tipoUsuario === "admin" && (
                                            <Link to="/administradores" className="admin-menu-item">Administradores</Link>
                                        )}
                                        {/* Eventos y disfraces son visibles tanto para administradores como moderadores */}
                                        <Link to="/eventos" className="admin-menu-item">Eventos</Link>
                                        <Link to="/disfraces" className="admin-menu-item">Disfraces</Link>
                                        <Link to="/etiquetas" className="admin-menu-item">Etiquetas</Link>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
