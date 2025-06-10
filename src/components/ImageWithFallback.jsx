import React, { useState } from 'react';
import { normalizeImages } from '../utils/imageUtils';

export default function ImageWithFallback({
    imagenes,
    index = 0,
    alt = '',
    className = '',
    style = {},
    placeholder = '/placeholder-image.jpg',
    loading = 'lazy',
    ...rest
}) {
    const urls = normalizeImages(imagenes);
    const [src, setSrc] = useState(urls[index] || placeholder);

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            style={style}
            loading={loading}
            onError={() => setSrc(placeholder)}
            {...rest}
        />
    );
}
