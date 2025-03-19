import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const Auth = () => {
    const [autenticado, setAutenticado] = useState(false);
    const [rol, setRol] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('tipoUsuario');
        setAutenticado(!!token);
        setRol(userRole);
    }, []);

    // Si está autenticado, redirige según su rol
    if (autenticado) {
        return <Navigate to={rol === "admin" ? "/" : "/"} />;
    }

    return (
        <main className="flex justify-center content-center w-full h-screen">
            <Outlet />
        </main>
    );
};

export default Auth;
