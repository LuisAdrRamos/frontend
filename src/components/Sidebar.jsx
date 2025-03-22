import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPhone, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faUser, faSignInAlt, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faWhatsapp, faInstagram } from "@fortawesome/free-brands-svg-icons";
import "../styles/sidebar.css";

// 📌 Información de las sucursales
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
        src: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d249.36266087396976!2d-78.3181939994935!3d-0.16097235436319585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sec!4v1740273880460!5m2!1ses-419!2sec"
    }
];

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
    // Estado para el mapa de sucursales
    const [mapSrc, setMapSrc] = useState(SUCURSALES[0].src);

    // Estado para etiquetas activas
    const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState([]);

    // Función para seleccionar etiquetas
    const handleEtiquetaSeleccionada = (etiqueta) => {
        setEtiquetasSeleccionadas((prev) => {
            return prev.includes(etiqueta) ? prev.filter((item) => item !== etiqueta) : [...prev, etiqueta];
        });
    };

    // 🟢 Bloquear el scroll del fondo cuando la sidebar está abierta
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
            {/* 📌 Overlay que oscurece el fondo */}
            <div className={`overlay ${sidebarOpen ? "active" : ""}`} onClick={toggleSidebar}></div>

            <aside className={`sidebar ${sidebarOpen ? "active" : ""}`}>
                {/* 📌 Botón para cerrar y autenticación */}
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
                                <button className="icon-btn logout-icon" title="Cerrar Sesión" onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("tipoUsuario");
                                    window.location.reload();
                                }}>
                                    <FontAwesomeIcon icon={faSignOutAlt} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* 📌 Barra de Búsqueda */}
                <form className="form-inline d-flex">
                    <input className="form-control" type="search" placeholder="Buscar..." aria-label="Search" />
                    <button className="btn btn-outline-success ms-2" type="submit">Buscar</button>
                </form>

                {/* 📌 Etiquetas */}
                <h2 className="sidebar-title">Etiquetas</h2>
                <div className="tags-container">
                    {["Chaqueta decorada", "Capa Roja", "Pantalón blanco", "Cinturón negro", "Botas negras"].map((tag, index) => (
                        <span
                            className={`tag ${etiquetasSeleccionadas.includes(tag) ? "active" : ""}`}
                            key={index}
                            onClick={() => handleEtiquetaSeleccionada(tag)}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* 📌 Mapa de Sucursales */}
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

                {/* 📌 Lista de Sucursales */}
                <ul className="sucursales-list">
                    {SUCURSALES.map((item, idx) => (
                        <li key={idx} onClick={() => setMapSrc(item.src)}>
                            {item.label}
                        </li>
                    ))}
                </ul>

                {/* 📌 Contacto y Redes Sociales */}
                <div className="sidebar-contact">
                    <button className="contact-btn">
                        <FontAwesomeIcon icon={faPhone} /> Contacto
                    </button>
                    <div className="social-icons">
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebookF} className="social-icon facebook" />
                        </a>
                        <a href="https://www.whatsapp.com/" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faWhatsapp} className="social-icon whatsapp" />
                        </a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} className="social-icon instagram" />
                        </a>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
