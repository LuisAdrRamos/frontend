import React from "react";

const BuscarDisfraz = ({ disfraces }) => {
    return (
        <div>
            <h2 className="title-disfraces">Lista de Disfraces</h2>
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
                            {disfraz.imagen && (
                                <img
                                    src={URL.createObjectURL(disfraz.imagen)}
                                    alt={disfraz.nombre}
                                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                                />
                            )}
                            <hr />
                        </ul>
                    ))}
                </ul>
            ) : (
                <p>No hay disfraces disponibles.</p>
            )}
        </div>
    );
};

export default BuscarDisfraz;