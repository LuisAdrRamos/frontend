// src/hooks/useDisfraces.js
import { useState, useEffect, useCallback } from "react";
import { normalizeImages } from "../utils/imageUtils";

export function useDisfraces(token) {
    const [disfraces, setDisfraces] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [etiquetas, setEtiquetas] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const [rD, rE, rF] = await Promise.all([
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/disfraz/listar`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/etiqueta/listar`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/festividad/festividades`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                if (!rD.ok || !rE.ok || !rF.ok) {
                    throw new Error("Error al cargar listas iniciales");
                }
                const [dd, ed, fd] = await Promise.all([rD.json(), rE.json(), rF.json()]);
                setDisfraces(dd);
                setFiltered(dd);
                setEtiquetas(ed);
                setEventos(fd);
            } catch (e) {
                console.error("useDisfraces:", e);
                setError(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [token]);

    const filtrar = useCallback(q => {
        if (!q.trim()) {
            setFiltered(disfraces);
            return;
        }
        const b = q.toLowerCase();
        setFiltered(disfraces.filter(d =>
            d.nombre.toLowerCase().includes(b) ||
            d.etiquetas?.some(et => et.nombre.toLowerCase().includes(b)) ||
            d.festividades?.some(f => f.nombre.toLowerCase().includes(b))
        ));
    }, [disfraces]);

    const fetchDetalle = useCallback(async id => {
        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/disfraz/detalle/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
            throw new Error(`Detalle error: ${res.status}`);
        }
        const data = await res.json();
        data.imagenes = normalizeImages(data.imagenes);
        return data;
    }, [token]);

    const eliminar = useCallback(async id => {
        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/disfraz/eliminar/${id}`,
            {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        if (!res.ok) {
            throw new Error(`Eliminar error: ${res.status}`);
        }
        setDisfraces(ds => ds.filter(d => d.id !== id));
        setFiltered(fs => fs.filter(d => d.id !== id));
    }, [token]);

    return {
        disfraces: filtered,
        etiquetas,
        eventos,
        loading,
        error,
        filtrar,
        fetchDetalle,
        eliminar,
        orig: disfraces
    };
}
