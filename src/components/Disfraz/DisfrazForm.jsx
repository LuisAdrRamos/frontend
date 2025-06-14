// src/components/DisfrazForm.jsx
import React from "react";
import ImagePreview from "./ImagePreview";
import "../../styles/modal.css";

export default function DisfrazForm({
    data,
    etiquetas,
    eventos,
    onChange,
    onEtiquetaAdd,
    onEtiquetaRemove,
    onFestAdd,
    onFestRemove,
    onFileAdd,
    onFileRemove,
    onSubmit,
    submitting,
    onCancel
}) {
    return (
        <div className="modal-container">
            <h2 className="modal-title">Editar Disfraz</h2>
            <form onSubmit={onSubmit} className="form-content">
                {/* Nombre */}
                <div className="form-group">
                    <label htmlFor="nombre" className="form-label">Nombre:</label>
                    <input
                        id="nombre"
                        name="nombre"
                        className="form-input"
                        value={data.nombre}
                        onChange={onChange}
                        required
                    />
                </div>

                {/* Descripción */}
                <div className="form-group">
                    <label htmlFor="descripcion" className="form-label">Descripción (máx. 250):</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        className="form-input1"
                        maxLength={250}
                        value={data.descripcion}
                        onChange={onChange}
                    />
                    <p className={data.descripcion.length >= 250 ? "text-error" : "form-help"}>
                        {data.descripcion.length} / 250
                    </p>
                </div>

                {/* Etiquetas */}
                <div className="form-group">
                    <label className="form-label">Etiquetas (máx. 6):</label>
                    <select
                        className="form-input1"
                        onChange={e => onEtiquetaAdd(+e.target.value)}
                        value=""
                    >
                        <option value="">Seleccione una etiqueta</option>
                        {etiquetas.map(et => (
                            <option key={et.id} value={et.id}>{et.nombre}</option>
                        ))}
                        <option value={-1}>➕ Crear nueva</option>
                    </select>
                    <ul className="etiquetas-list">
                        {data.etiquetas.map(id => {
                            const et = etiquetas.find(x => x.id === id);
                            return (
                                <li key={id} className="tag-item">
                                    {et?.nombre}
                                    <button
                                        type="button"
                                        className="remove-button"
                                        onClick={() => onEtiquetaRemove(id)}
                                    >
                                        ×
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <p className="form-help">{data.etiquetas.length} / 6 seleccionadas</p>
                </div>

                {/* Festividades */}
                <div className="form-group">
                    <label className="form-label">Festividades (máx. 5):</label>
                    <select
                        className="form-input1"
                        onChange={e => onFestAdd(+e.target.value)}
                        value=""
                    >
                        <option value="">Seleccione una festividad</option>
                        {eventos.map(ev => (
                            <option key={ev.id} value={ev.id}>{ev.nombre}</option>
                        ))}
                        <option value={-1}>➕ Crear nueva</option>
                    </select>
                    <ul className="festividades-list">
                        {data.festividades.map(id => {
                            const f = eventos.find(x => x.id === id);
                            return (
                                <li key={id} className="tag-item">
                                    {f?.nombre}
                                    <button
                                        type="button"
                                        className="remove-button"
                                        onClick={() => onFestRemove(id)}
                                    >
                                        ×
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <p className="form-help">{data.festividades.length} / 5 seleccionadas</p>
                </div>

                {/* Imágenes */}

                <div className="form-group">
                    <label className="form-label">Imágenes (máx. 3):</label>
                    <div className="image-preview-container">
                        {data.imagenes.map((img, idx) => (
                            <ImagePreview
                                key={idx}
                                src={img.preview || img.url}
                                onRemove={() => onFileRemove(idx)}
                            />
                        ))}
                        {data.imagenes.length < 3 && (
                            <label className="image-box upload-box">
                                <span className="add-image-label">+</span>
                                <span className="add-image-text">Añadir imagen</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    multiple
                                    onChange={onFileAdd}
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Botones */}
                <div className="form-actions">
                    <button type="submit" className="form-button" disabled={submitting}>
                        {submitting ? "Actualizando..." : "Guardar Cambios"}
                    </button>
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
