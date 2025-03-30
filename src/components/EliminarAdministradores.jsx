import React, { useState } from "react";
import "../styles/c_ac_bsc_elim_admin.css";
import "../styles/modal.css";

const EliminarAdministradores = ({ administradoresIniciales, onEliminar }) => {
    const [administradores, setAdministradores] = useState(administradoresIniciales);
    const [showModal, setShowModal] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState(null);

    const handleEliminar = (index) => {
        setAdminToDelete(index);
        setShowModal(true);
    };

    const confirmEliminar = () => {
        const nuevosAdministradores = administradores.filter((_, i) => i !== adminToDelete);
        setAdministradores(nuevosAdministradores);
        if (onEliminar) {
            onEliminar(nuevosAdministradores);
        }
        setShowModal(false);
        setAdminToDelete(null);
    };

    return (
        <div className="form-container">
            <h2 className="title-eliminar">Eliminar Administradores</h2>
            {administradores.length > 0 ? (
                <ul className="admin-list">
                    {administradores.map((admin, index) => (
                        <ul key={index} className="admin-item">
                            <strong>Nombre:</strong> {admin.nombre} <br />
                            <strong>Apellido:</strong> {admin.apellido} <br />
                            <strong>Dirección:</strong> {admin.direccion} <br />
                            <strong>Teléfono:</strong> {admin.telefono} <br />
                            <strong>Email:</strong> {admin.email} <br />
                            <button onClick={() => handleEliminar(index)} className="form-button_eliminar">Eliminar</button>
                            <hr />
                        </ul>
                    ))}
                </ul>
            ) : (
                <p>No hay administradores disponibles.</p>
            )}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-body">
                            <p>¿Estás seguro de que deseas eliminar este administrador?</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowModal(false)} className="modal-button confirm">Cancelar</button>
                            <button onClick={confirmEliminar} className="modal-button confirm">Aceptar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EliminarAdministradores;
