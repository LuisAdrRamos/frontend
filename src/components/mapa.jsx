// 📁 src/pages/Mapa.jsx
import React, { useState } from "react";

import localYaruki1 from "../assets/localYaruki1.jpg"
import localYaruki2 from "../assets/localYaruki2.jpg"
import localCayambe from "../assets/localCayambe.jpg"


import { FaInstagram, FaGoogle, FaTwitter, FaTiktok, FaWhatsapp } from "react-icons/fa";
import "../styles/mapa.css";

const SUCURSALES = [
    {
        label: "1ra Sucursal: YARUQUI CENTRO",
        src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d249.3626477649494!2d-78.31752496658034!3d-0.16204089881778425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d593004a7fa75f%3A0x5eea80851419080a!2sMegadisfraz!5e0!3m2!1ses-419!2sec!4v1740273750468!5m2!1ses-419!2sec",
        image: localYaruki1
    },
    {
        label: "2da Sucursal: CAYAMBE CENTRO",
        src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d296.54494697342307!2d-78.14407258761588!3d0.04045211760451157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e2a08f745888e7b%3A0x836a42c1eea0bfb1!2sCentro%20Comercial%20de%20Vendedores%20Aut%C3%B3nomos!5e0!3m2!1ses-419!2sec!4v1740273826714!5m2!1ses-419!2sec",
        image: localCayambe
    },
    {
        label: "3ra Sucursal: YARUQUI - UPC",
        src: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d249.36266087396976!2d-78.3181939994935!3d-0.16097235436319585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2sec",
        image: localYaruki2
    }
];

export default function Mapa() {
    const [mapSrc, setMapSrc] = useState(SUCURSALES[0].src);
    const [selectedSucursal, setSelectedSucursal] = useState(SUCURSALES[0]);



    return (
        <div className="mapa-wrapper">
            <h2 className="sidebar-title">Mapa Sucursales</h2>
            <div className="mapa-layout">
                <ul className="sucursales-list">
                    {SUCURSALES.map((item, idx) => (
                        <li key={idx} onClick={() => setSelectedSucursal(item)}>
                            {item.label}
                        </li>
                    ))}
                </ul>

                <div className="map-container">
                    <iframe
                        title="mapa-sucursales"
                        src={selectedSucursal.src}
                        width="100%"
                        height="200"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>

                <div className="local-image">
                    <img src={selectedSucursal.image} alt={`Local de ${selectedSucursal.label}`} />
                </div>
            </div>

            <div className="social-icons">
                <a href="https://www.instagram.com/megadisfraz_yaruqui?igsh=dHJwd3hmaHU2aTNq"><FaInstagram /></a>
                <a href="https://x.com/Megadisfraz?t=IxW60maTBR2FoOO_RNDDeQ&s=09"><FaTwitter /></a>
                <a href="https://www.tiktok.com/@megadisfraz_yaruqui?_t=ZM-8wGmbrvw46Y&_r=1"><FaTiktok /></a>
                <a href="https://wa.me/593939232766"><FaWhatsapp /></a>
                <a href="webmegadisfraz513@gmail.com"><FaGoogle/></a>
            </div>
            <p className="footer-text">© 2025 Megadisfraz</p>
        </div>
    );
}
