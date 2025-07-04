// navbar.jsx
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

    const handleMonthHover = async (mes) => {
        setHoveredMonth(mes);
        try {
            const festividades = await listarEventosPorMes(mes);
            setEventosMes(festividades[mes] || []);
        } catch (error) {
            console.error("Error al obtener festividades del mes:", error);
        }
    };

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

    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

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
                {meses.map((mes) => (
                    <li
                        className="nav-item"
                        key={mes}
                        onMouseEnter={() => handleMonthHover(mes)}
                        onMouseLeave={handleMonthLeave}
                    >
                        <button className="month-link" onClick={() => handleMonthClick(mes)}>
                            {mes}
                        </button>
                        {hoveredMonth === mes && eventosMes.length > 0 && (
                            <div className="event-dropdown">
                                <div className="event-dropdown-header">
                                    <h4>Eventos en {mes}</h4>
                                </div>
                                <ul className="event-list">
                                    {eventosMes.map((evento) => (
                                        <li
                                            key={evento.id}
                                            className="event-item"
                                            onClick={() => navigate(`/searches?event=${encodeURIComponent(evento.nombre)}`)}
                                        >
                                            <span className="event-day">{evento.dia}</span>
                                            <div>
                                                <div className="event-name">{evento.nombre}</div>
                                                {evento.descripcion && (
                                                    <div className="event-desc">{evento.descripcion}</div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
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
