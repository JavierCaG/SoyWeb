import React, { useState, useEffect } from 'react';
import './Entry.css'; // Asegúrate de importar el CSS actualizado
import SongEntry from './entryMapper/songEntry';
import MediaEntry from './entryMapper/mediaEntry';
import TextAudioEntry from './entryMapper/textEntry';

const EntriesManager = ({ entries, albumEntries, onEntryClick }) => {
    const [rotationAngle, setRotationAngle] = useState(0);
    const [isRotating, setIsRotating] = useState(true);
    const [isHovering, setIsHovering] = useState(false);

    const getEntryType = (entry) => {
        if (entry.cancion) {
            return 'song';
        } else if (entry.media && entry.mediaType) {
            return 'media';
        } else if (entry.audio || entry.texto) {
            return 'textAudio';
        } else {
            return 'unknown';
        }
    };

    useEffect(() => {
        let intervalId;
        if (isRotating) {
            intervalId = setInterval(() => {
                setRotationAngle(prevAngle => prevAngle + 0.5); // Ajusta la velocidad según sea necesario
            }, 50);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isRotating]);

    return (
        <div className="entries-manager">
            <div className="entries-selector">
                <h3>Entradas Disponibles</h3>
                <div
                    className="wrapper"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {isHovering && (
                        <>
                            <div
                                className="arrow left-arrow"
                                onClick={() => setRotationAngle(prev => prev - 30)}
                            >
                                &lt;
                            </div>
                            <div
                                className="arrow right-arrow"
                                onClick={() => setRotationAngle(prev => prev + 30)}
                            >
                                &gt;
                            </div>
                        </>
                    )}
                    <div
                        className="inner"
                        style={{
                            '--quantity': entries.length,
                            transform: `perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(${rotationAngle}deg)`,
                        }}
                        onMouseEnter={() => setIsRotating(false)}
                        onMouseLeave={() => setIsRotating(true)}
                    >
                        {entries.length === 0 ? (
                            <p>No hay entradas disponibles.</p>
                        ) : (
                            entries.map((entry, index) => {
                                const entryType = getEntryType(entry);
                                let EntryComponent;

                                switch (entryType) {
                                    case 'song':
                                        EntryComponent = SongEntry;
                                        break;
                                    case 'media':
                                        EntryComponent = MediaEntry;
                                        break;
                                    case 'textAudio':
                                        EntryComponent = TextAudioEntry;
                                        break;
                                    default:
                                        return null;
                                }

                                const isSelected = albumEntries.some(ae => ae.id === entry.id);

                                // Puedes generar colores dinámicamente o usar uno fijo
                                const colorCard = '142, 249, 252';

                                return (
                                    <div
                                        key={entry.id}
                                        className={`card ${isSelected ? 'selected' : ''}`}
                                        style={{ '--index': index, '--color-card': colorCard }}
                                        onClick={() => onEntryClick(entry)}
                                    >
                                        <div className="img">
                                            {/* Renderiza el componente de la entrada */}
                                            <EntryComponent entry={entry} />
                                        </div>
                                        {isSelected && (
                                            <div className="selected-overlay">
                                                ✓
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EntriesManager;
