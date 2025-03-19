import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom"; // Para renderizar las páginas dentro del layout
import "../styles/dashboard.css"; // ✅ Importamos el archivo de estilos

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="parent">
            <div className="div1"> {/* Aquí va la navbar */}
                <Navbar toggleSidebar={toggleSidebar} />
            </div>

            {/* 📌 Sidebar - Controlada por sidebar.css */}
            <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="div3">
                <Outlet /> {/* Aquí se cargará el contenido dinámico según la ruta */}
            </div>
            <div className="div4"> {/* Aquí va el footer */}
                <Footer />
            </div>
        </div>
    );
};

export default Dashboard;
