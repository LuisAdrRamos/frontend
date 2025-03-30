import React, { useState } from "react";
import "../styles/c_ac_bsc_elim_admin.css";
import "../styles/modal.css";

const EliminarDisfraces = ({ disfracesIniciales, onEliminar }) => {
    const [disfraces, setDisfraces] = useState(disfracesIniciales);
    const [showModal, setShowModal] = useState(false);
    const [disfracesToDelete, setdisfracesToDelete] = useState(null);

    const handleEliminar = (index) => {
        setdisfracesToDelete(index);
        setShowModal(true);
    };


    const confirmEliminar = () => {
        const nuevosDisfraces = disfraces.filter((_, i) => i !== disfracesToDelete);
        setDisfraces(nuevosDisfraces);
        if (onEliminar) {
            onEliminar(nuevosDisfraces);
        }
        setShowModal(false);
        setdisfracesToDelete(null);
    };

    return (
        <div>
            <h2 className="title-disfraces">Eliminar Disfraces</h2>
            {disfraces.length > 0 ? (
                <ul>
                    {disfraces.map((disfraz, index) => (
                        <ul key={index} className="form-content1">
                            <strong>Nombre:</strong> {disfraz.nombre} <br />
                            <strong>Talla:</strong> {disfraz.talla} <br />
                            <strong>Calidad:</strong> {disfraz.calidad} <br />
                            <strong>Categoría:</strong> {disfraz.categoria} <br />
                            <strong>Precio:</strong> ${disfraz.precio} <br />
                            <strong>Festividad:</strong> {disfraz.festividad} <br />
                            <strong>Descripción:</strong> {disfraz.descripcion} <br />
                            <button onClick={() => handleEliminar(index)} className="form-button_eliminar">Eliminar</button>
                            <hr />
                        </ul>
                    ))}
                </ul>
            ) : (
                <p>No hay disfraces disponibles.</p>
            )}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-body">
                            <p>¿Estás seguro de que deseas eliminar este disfraz?</p>
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

export default EliminarDisfraces;