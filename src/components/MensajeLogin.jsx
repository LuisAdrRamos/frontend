import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/Mensaje.css';

const Mensaje = ({ children, tipo }) => {
  const mensajeClase = tipo === 'success' ? 'success' : 'error';
  const icono = tipo === 'success' ? faCheckCircle : faXmarkCircle;

  return (
    <div className={`mensaje-container ${mensajeClase}`}>
      <FontAwesomeIcon icon={icono} className="mensaje-icon" />
      <div className="mensaje-text">
        <p>{children}</p>
      </div>
    </div>
  );
};

export default Mensaje;
