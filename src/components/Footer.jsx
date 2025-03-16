import React from "react";
import "../styles/footer.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaGoogle, FaYoutube } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="social-icons">
                <a href="#"><FaFacebookF /></a>
                <a href="#"><FaInstagram /></a>
                <a href="#"><FaTwitter /></a>
                <a href="#"><FaGoogle /></a>
                <a href="#"><FaYoutube /></a>
            </div>
            <ul className="footer-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">News</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Our Team</a></li>
            </ul>
            <p className="footer-text">© 2025 Megadisfraz</p>
        </footer>
    );
}

export default Footer;