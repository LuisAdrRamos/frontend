import React from "react";
import "../styles/footer.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaGoogle, FaYoutube, FaTiktok, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="footer">
            <ul className="footer-links">
                <li><a href="https://wa.me/593939232766"><FaWhatsapp/>Whatsapp.</a></li>
                <li><a href="webmegadisfraz513@gmail.com">Gmail.</a></li>
            </ul>
            <p className="footer-text">© 2025 Megadisfraz</p>
        </footer>
    );
}

export default Footer;