import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom"; // Para renderizar las páginas dentro del layout
import "../styles/dashboard.css"; // ✅ Importamos el archivo de estilos

const Dashboard = () => {
    return (
        <div className="parent">
            <div className="div1">
                <Navbar />
            </div>
            <div className="div2">
                <Sidebar />
            </div>
            <div className="div3">
                <Outlet /> {/* Aquí se cargará el contenido dinámico según la ruta */}
            </div>
            <div className="div4">
                <Footer />
            </div>
        </div>
    );
};

export default Dashboard;
