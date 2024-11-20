// src/components/MediaEntry.jsx
import React from 'react';
import './MediaEntry.css'; // Estilos específicos para MediaEntry

const MediaEntry = ({ entry, onClick }) => {
    return (
        <div className="media-entry-card" onClick={() => onClick(entry)}>
            {entry.mediaType === 'image' ? (
                <img src={entry.media} alt="Media" className="media-entry-image" />
            ) : entry.mediaType === 'video' ? (
                <video controls className="media-entry-video">
                    <source src={entry.media} type="video/mp4" />
                    Tu navegador no soporta la etiqueta de video.
                </video>
            ) : null}
            <p className="media-text">{entry.texto}</p>
        </div>
    );
};

export default MediaEntry;
