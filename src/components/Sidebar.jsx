import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DisfracesContext from "../context/ProductosProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faMapMarkerAlt, faUser, faSignInAlt, faSignOutAlt, faMagnifyingGlass, faCog, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Mapa from "./mapa";
import "../styles/sidebar.css";

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
    const [etiquetas, setEtiquetas] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAdminMenu, setShowAdminMenu] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { disfraces } = useContext(DisfracesContext);

    const tipoUsuario = localStorage.getItem("tipoUsuario");

    const toggleAdminMenu = () => {
        setShowAdminMenu(prev => !prev);
    };

    useEffect(() => {
        const fetchEtiquetas = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/etiqueta/listar`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (!response.ok) throw new Error("Error al obtener las etiquetas");

                const data = await response.json();
                setEtiquetas(data);
            } catch (error) {
                console.error("Error al cargar las etiquetas:", error);
            }
        };

        fetchEtiquetas();
    }, []);

    const handleEtiquetaClick = (etiqueta) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set("etiqueta", etiqueta);
        navigate(`/searches?${queryParams.toString()}`);
        toggleSidebar();
    };

    const handleSearch = () => {
        if (searchTerm.trim()) {
            const resultados = disfraces.filter(disfraz =>
                disfraz.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                disfraz.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (resultados.length > 0) {
                navigate(`/searches?query=${searchTerm}`);
                toggleSidebar();
            }
        }
    };

    useEffect(() => {
        if (sidebarOpen) {
            document.body.classList.add("sidebar-open");
        } else {
            document.body.classList.remove("sidebar-open");
        }
        return () => document.body.classList.remove("sidebar-open");
    }, [sidebarOpen]);


    return (
        <>
            <div className={`overlay ${sidebarOpen ? "active" : ""}`} onClick={toggleSidebar}></div>

            <aside className={`sidebar ${sidebarOpen ? "active" : ""}`}>

                <div className="sidebar-top">
                    <button className="close-btn" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>

                    <div className="sidebar-auth-icons">
                        {!localStorage.getItem("token") ? (
                            <Link to="/login" className="icon-btn login-icon" title="Iniciar Sesión">
                                <FontAwesomeIcon icon={faSignInAlt} />
                            </Link>
                        ) : (
                            <div className="auth-icons-wrapper">
                                <Link to="/perfil" className="icon-btn profile-icon" title="Perfil">
                                    <FontAwesomeIcon icon={faUser} />
                                </Link>
                                <button className="icon-btn logout-icon" title="Cerrar Sesión" onClick={() => {
                                    localStorage.clear();
                                    window.location.reload();
                                }}>
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
                            </div>
                        )}
                    </div>

                </div>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Buscar"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSearch();
                            }
                        }}
                        className="search-input"
                    />

                    <button className="search-btn" onClick={handleSearch}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>

                <h2 className="sidebar-title">Etiquetas</h2>
                <div className="tags-container">
                    {etiquetas.map((etiqueta) => (
                        <button
                            key={etiqueta.id}
                            className="tag-button"
                            onClick={() => handleEtiquetaClick(etiqueta.nombre)}
                        >
                            {etiqueta.nombre}
                        </button>
                    ))}
                </div>

                {/* <Mapa /> */}

            </aside>
        </>
    );
};

export default Sidebar;