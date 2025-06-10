// imageUtils.js
/**
 * Asegura que `imagenes` siempre sea un array de URLs.
 * Si viene como JSON stringificado lo parsea, si no, lo deja como está.
 */
export function normalizeImages(imagenes) {
    if (typeof imagenes === 'string') {
        try {
            const parsed = JSON.parse(imagenes);
            return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
            console.warn('normalizeImages: error al parsear', err);
            return [];
        }
    }
    return Array.isArray(imagenes) ? imagenes : [];
}