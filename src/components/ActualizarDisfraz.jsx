// src/components/ActualizarDisfraz.jsx
import React, { useState } from "react";
import { useDisfraces } from "../hooks/useDisfraces";
import SearchBar from "./Disfraz/SearchBar";
import DisfrazList from "./Disfraz/DisfrazList";
import DisfrazForm from "./Disfraz/DisfrazForm";
import "../styles/modal.css";

export default function ActualizarDisfrazPage() {
    const token = localStorage.getItem("token");
    const {
        disfraces,
        etiquetas,
        eventos,
        loading,
        error,
        filtrar,
        fetchDetalle,
        eliminar
    } = useDisfraces(token);

    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        etiquetas: [],       // IDs
        festividades: [],    // IDs
        imagenes: []         // { url, preview } o { file, preview }
    });
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1) Cargar datos al hacer clic en "Editar"
    const handleEdit = async (id) => {
        try {
            const data = await fetchDetalle(id);
            setFormData({
                nombre: data.nombre,
                descripcion: data.descripcion || "",
                etiquetas: (data.etiquetas || []).map(et => et.id),
                festividades: (data.festividades || []).map(f => f.id),
                imagenes: data.imagenes.map(u => ({ url: u, preview: u }))
            });
            setSelectedId(id);
            setIsEditing(true);
        } catch {
            alert("Error al cargar detalles del disfraz");
        }
    };

    // 2) Cancelar edición
    const handleCancel = () => {
        setIsEditing(false);
        setFormData({ nombre: "", descripcion: "", etiquetas: [], festividades: [], imagenes: [] });
        setSelectedId(null);
    };

    // 3) Inputs de texto (nombre, descripción)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(f => ({ ...f, [name]: value }));
    };

    // 4) Etiquetas
    const handleEtiquetaAdd = (id) => {
        if (id === -1) return window.location.href = "/admin/etiquetas/crear";
        setFormData(f =>
            f.etiquetas.includes(id) || f.etiquetas.length >= 6
                ? f
                : { ...f, etiquetas: [...f.etiquetas, id] }
        );
    };
    const handleEtiquetaRemove = (id) => {
        setFormData(f => ({ ...f, etiquetas: f.etiquetas.filter(x => x !== id) }));
    };

    // 5) Festividades
    const handleFestAdd = (id) => {
        if (id === -1) return window.location.href = "/admin/festividades/crear";
        setFormData(f =>
            f.festividades.includes(id) || f.festividades.length >= 5
                ? f
                : { ...f, festividades: [...f.festividades, id] }
        );
    };
    const handleFestRemove = (id) => {
        setFormData(f => ({ ...f, festividades: f.festividades.filter(x => x !== id) }));
    };

    // 6) Archivos: añadir/quitar previews
    const handleFileAdd = (e) => {
        const files = Array.from(e.target.files).slice(0, 3 - formData.imagenes.length);
        const nuevos = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
        setFormData(f => ({ ...f, imagenes: [...f.imagenes, ...nuevos] }));
    };
    const handleFileRemove = (idx) => {
        setFormData(f => ({ ...f, imagenes: f.imagenes.filter((_, i) => i !== idx) }));
    };

    // 7) Envío: si hay archivos nuevos, subimos a Cloudinary y luego mandamos JSON
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Separamos URLs existentes de archivos nuevos
            const existingUrls = formData.imagenes
                .filter(i => i.url)
                .map(i => i.url);
            const newFiles = formData.imagenes
                .filter(i => i.file)
                .map(i => i.file);

            // 7.1) Subir nuevos a Cloudinary (si los hay)
            let uploadedUrls = [];
            if (newFiles.length > 0) {
                const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
                const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
                uploadedUrls = await Promise.all(newFiles.map(async file => {
                    const fd = new FormData();
                    fd.append("file", file);
                    fd.append("upload_preset", preset);
                    const resp = await fetch(
                        `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
                        { method: "POST", body: fd }
                    );
                    const json = await resp.json();
                    return json.secure_url;
                }));
            }

            // 7.2) Payload JSON final
            const payload = {
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                etiquetas: formData.etiquetas,
                festividades: formData.festividades,
                imagenes: [...existingUrls, ...uploadedUrls]
            };

            console.log("Enviando JSON:", payload);

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/disfraz/actualizar/${selectedId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!res.ok) {
                const err = await res.json().catch(() => ({ msg: "Error desconocido" }));
                throw new Error(err.msg);
            }

            alert("✅ Disfraz actualizado correctamente");
            window.location.reload();

        } catch (err) {
            console.error("❌ Error al actualizar disfraz:", err);
            alert("❌ " + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div>Cargando disfraces…</div>;
    if (error) return <div>Error: {error.message || "Desconocido"}</div>;

    return (
        <div className="form-container">
            {!isEditing ? (
                <>
                    <h2 className="titlelistDis">Lista de Disfraces</h2>
                    <SearchBar onChange={filtrar} />
                    <DisfrazList
                        items={disfraces}
                        onEdit={handleEdit}
                        onDelete={eliminar}
                    />
                </>
            ) : (
                <DisfrazForm
                    data={formData}
                    etiquetas={etiquetas}
                    eventos={eventos}
                    onChange={handleChange}
                    onEtiquetaAdd={handleEtiquetaAdd}
                    onEtiquetaRemove={handleEtiquetaRemove}
                    onFestAdd={handleFestAdd}
                    onFestRemove={handleFestRemove}
                    onFileAdd={handleFileAdd}
                    onFileRemove={handleFileRemove}
                    onSubmit={handleSubmit}
                    submitting={isSubmitting}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
}
