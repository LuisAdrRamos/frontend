import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const autenticado = localStorage.getItem('token');
  const rol = localStorage.getItem("tipoUsuario");

  // Si no está autenticado o no tiene el rol correcto, redirigir a inicio
  if (!autenticado || (allowedRoles && !allowedRoles.includes(rol))) {
    return <Navigate to='/' />;
  }

  return children;
};

export default PrivateRoute;