import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkSlash } from '@fortawesome/free-solid-svg-icons';
import '../styles/NotFound.css'; // Importa los estilos CSS

export const NotFound = () => {
    return (
        <div className="not-found-container">
            <img
                src="public/Imagenes/logo.png"
                alt="Logo Megadisfraz"
                className="header-logo-img"
            />
            <span className="brand-text">Megadisfraz</span>
            <div className="not-found-icon-wrapper">
                <FontAwesomeIcon icon={faLinkSlash} className="not-found-icon" />
            </div>
            <div className="not-found-content-wrapper">
                <div className="not-found-content">
                    <p className="not-found-title">Pagina no encontrada</p>
                    <p className="not-found-text">Lo sentimos, la pagina que buscas no se puedo encontrar</p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;