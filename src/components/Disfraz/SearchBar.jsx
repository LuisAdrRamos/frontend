// src/components/SearchBar.jsx
export default function SearchBar({ value, onChange }) {
    return (
        <div className="form-content">
            <label>Buscar:</label>
            <input
                className="form-input"
                placeholder="Nombre, etiqueta o festividad"
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
}
