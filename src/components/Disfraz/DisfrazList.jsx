// src/components/DisfrazList.jsx
export default function DisfrazList({ items, onEdit, onDelete }) {
    return (
        <ul className="disfraz-list">
            {items.map(d => (
                <li key={d.id} className="disfraz-item">
                    <div className="disfraz-info">
                        <strong>Nombre:</strong> {d.nombre}<br />
                        <strong>Etiquetas:</strong> {d.etiquetas?.map(et => et.nombre).join(", ")}<br />
                        <strong>Festividades:</strong> {d.festividades?.map(f => f.nombre).join(", ")}
                    </div>
                    <div className="disfraz-actions">
                        <button className="edit-button2" onClick={() => onEdit(d.id)}>Editar</button>
                        <button className="delete-button2" onClick={() => onDelete(d.id)}>Eliminar</button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
