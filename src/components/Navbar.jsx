import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faSignInAlt, faSignOutAlt, faCog, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import EventosContext from "../context/EventosProvider";
import "../styles/navbar.css";

const Navbar = ({ toggleSidebar }) => {
    const [autenticado, setAutenticado] = useState(false);
    const [tipoUsuario, setTipoUsuario] = useState(null);
    const [showAdminMenu, setShowAdminMenu] = useState(false);

    // Estados para eventos por mes
    const [hoveredMonth, setHoveredMonth] = useState(null);
    const [eventosMes, setEventosMes] = useState([]);

    const { listarEventosPorMes } = useContext(EventosContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const usuarioTipo = localStorage.getItem("tipoUsuario");
        setAutenticado(!!token);
        setTipoUsuario(usuarioTipo);
    }, []);

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("tipoUsuario");
        setAutenticado(false);
        setTipoUsuario(null);
        navigate("/");
        window.location.reload();
    };

    // Mostrar eventos al hacer hover sobre un mes
    const handleMonthHover = async (mes) => {
        setHoveredMonth(mes);
        try {
            const festividades = await listarEventosPorMes(mes);
            setEventosMes(festividades[mes] || []);
        } catch (error) {
            console.error("Error al obtener festividades del mes:", error);
        }
    };

    // Ocultar eventos cuando el mouse se aleje
    const handleMonthLeave = () => {
        setHoveredMonth(null);
        setEventosMes([]);
    };

    const toggleAdminMenu = () => {
        setShowAdminMenu(!showAdminMenu);
    };

    const handleMonthClick = (mes) => {
        navigate(`/searches?month=${mes}`);
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

            {/* Meses con hover para festividades */}
            <ul className="navbar-meses">
                {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"].map((mes, index) => (
                    <li
                        className="nav-item"
                        key={index}
                        onMouseEnter={() => handleMonthHover(mes)}
                        onMouseLeave={handleMonthLeave}
                    >
                        <button className="nav-link" onClick={() => handleMonthClick(mes)}>
                            {mes}
                        </button>

                        {/* Mostrar festividades en un dropdown cuando se hace hover */}
                        {hoveredMonth === mes && eventosMes.length > 0 && (
                            <ul className="event-dropdown">
                                {eventosMes.map((evento) => (
                                    <li 
                                        key={evento.id} 
                                        className="event-item"
                                        onClick={() => navigate(`/searches?event=${encodeURIComponent(evento.nombre)}`)} // ✅ Redirigir con `event`
                                    >
                                        {evento.nombre} - {evento.dia}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>

            {/* Autenticación */}
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

                        {(tipoUsuario === "admin" || tipoUsuario === "moderador") && (
                            <div className="admin-menu-container">
                                <button className="icon-btn admin-icon" onClick={toggleAdminMenu} title="Administrador">
                                    <FontAwesomeIcon icon={faCog} /> <FontAwesomeIcon icon={faChevronDown} />
                                </button>

                                {showAdminMenu && (
                                    <div className="admin-menu">
                                        {tipoUsuario === "admin" && (
                                            <Link to="/administradores" className="admin-menu-item">Administradores</Link>
                                        )}
                                        <Link to="/eventos" className="admin-menu-item">Eventos</Link>
                                        <Link to="/disfraces" className="admin-menu-item">Disfraces</Link>
                                        <Link to="/etiquetas" className="admin-menu-item">Etiquetas</Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;