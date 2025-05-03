import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DisfracesContext from "../context/ProductosProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faUser, faSignInAlt, faSignOutAlt, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "../styles/sidebar.css";

const SUCURSALES = [
    { 
        label: "1ra Sucursal: YARUQUI CENTRO", 
        src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d249.3626477649494!2d-78.31752496658034!3d-0.16204089881778425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d593004a7fa75f%3A0x5eea80851419080a!2sMegadisfraz!5e0!3m2!1ses-419!2sec!4v1740273750468!5m2!1ses-419!2sec" 
    }, 
    { 
        label: "2da Sucursal: CAYAMBE CENTRO", 
        src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d296.54494697342307!2d-78.14407258761588!3d0.04045211760451157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2a08f745888e7b%3A0x836a42c1eea0bfb1!2sCentro%20Comercial%20de%20Vendedores%20Aut%C3%B3nomos!5e0!3m2!1ses-419!2sec!4v1740273826714!5m2!1ses-419!2sec" 
    }, 
    { 
        label: "3ra Sucursal: YARUQUI - UPC", 
        src: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d249.36266087396976!2d-78.3181939994935!3d-0.16097235436319585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sec" 
    }
];

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
    const [mapSrc, setMapSrc] = useState(SUCURSALES[0].src);
    const [etiquetas, setEtiquetas] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const { disfraces } = useContext(DisfracesContext);

    const tipoUsuario = localStorage.getItem("tipoUsuario");

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

    // ✅ Navegar sin eliminar los filtros anteriores
    const handleEtiquetaClick = (etiqueta) => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set("etiqueta", etiqueta); // ✅ Agrega la etiqueta sin borrar otros filtros
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

                {/* Cerrar y autenticación */}
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
                            <>
                                <Link to="/perfil" className="icon-btn profile-icon" title="Perfil">
                                    <FontAwesomeIcon icon={faUser} />
                                </Link>
                                <button
                                    className="icon-btn logout-icon"
                                    title="Cerrar Sesión"
                                    onClick={() => {
                                        localStorage.clear();
                                        window.location.reload();
                                    }}
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Buscador */}
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

                {/* Etiquetas */}
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

                {/* Mapa */}
                <h2 className="sidebar-title">Mapa Sucursales</h2>
                <div className="map-container">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="map-icon" />
                    <iframe
                        title="mapa-sucursales"
                        src={mapSrc}
                        width="100%"
                        height="150"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>

                {/* Lista de sucursales */}
                <ul className="sucursales-list">
                    {SUCURSALES.map((item, idx) => (
                        <li key={idx} onClick={() => setMapSrc(item.src)}>
                            {item.label}
                        </li>
                    ))}
                </ul>
            </aside>
        </>
    );
};

export default Sidebar;
