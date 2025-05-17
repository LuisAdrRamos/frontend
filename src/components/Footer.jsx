import React from "react";
import "../styles/footer.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaGoogle, FaYoutube, FaTiktok, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="social-icons">
                <a href="https://www.instagram.com/megadisfraz_yaruqui?igsh=dHJwd3hmaHU2aTNq"><FaInstagram /></a>
                <a href="https://x.com/Megadisfraz?t=IxW60maTBR2FoOO_RNDDeQ&s=09"><FaTwitter /></a>
                <a href="https://www.tiktok.com/@megadisfraz_yaruqui?_t=ZM-8wGmbrvw46Y&_r=1"><FaTiktok /></a>
            </div>
            <ul className="footer-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">News</a></li>
                <li><a href="https://wa.me/593939232766"><FaWhatsapp/>Whatsapp</a></li>
                <li><a href="webmegadisfraz513@gmail.com">Gmail</a></li>
            </ul>
            <p className="footer-text">© 2025 Megadisfraz</p>
        </footer>
    );
}

export default Footer;