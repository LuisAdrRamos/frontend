// src/components/Disfraz/ImagePreview.jsx
import React from "react";

export default function ImagePreview({ src, onRemove }) {
    return (
        <div className="image-box">
            <img src={src} alt="" className="preview-img" />
            <button
                type="button"
                className="remove-button"
                onClick={onRemove}
            >
                ×
            </button>
        </div>
    );
}
