// src/page/album/Album.js

import React, { useState, useEffect } from 'react';
import './Album.css';
import { useAuth } from '../auth/authContext';
import EntriesManager from '../entry/entry'; // Asegúrate de importar correctamente
import useEntries from '../entry/useEntries';
import SideMenu from './sideMenu';
import CreateAlbum from './createAlbum';
import ListAlbums from './listAlbums';
import SelectedAlbum from './selectedAlbum';
import {
    DndContext,
    useDroppable,
    useDraggable,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const Album = () => {
    const { currentUser, albums, addAlbum, modifyAlbum, removeAlbum } = useAuth();
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [newAlbumName, setNewAlbumName] = useState('');
    const [isMenuExpanded, setIsMenuExpanded] = useState(false);
    const [activeOption, setActiveOption] = useState(null);
    const [localAlbumEntries, setLocalAlbumEntries] = useState([]);

    const {
        entries,
        albumEntries,
        albumBackground,
        loading,
        setAlbumBackground,
        updateAlbumEntries,
    } = useEntries(currentUser, selectedAlbum);

    // Configuración de sensores para @dnd-kit
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    useEffect(() => {
        if (Array.isArray(albums) && albums.length > 0 && !selectedAlbum) {
            setSelectedAlbum(albums[0]);
        }
    }, [albums, selectedAlbum]);

    useEffect(() => {
        if (Array.isArray(albumEntries)) {
            // Asegúrate de que cada entrada tenga una posición inicial
            const entriesWithPosition = albumEntries.map(entry => ({
                ...entry,
                position: entry.position || { x: 0, y: 0 }, // Posición inicial predeterminada
            }));
            setLocalAlbumEntries(entriesWithPosition);
        }
    }, [albumEntries]);

    if (loading) {
        return <p className="loading">Cargando...</p>;
    }

    if (!albums || !Array.isArray(albums)) {
        console.log("Albums no está definido o no es un arreglo:", albums);
        return <p className="error">No se pudieron cargar los álbumes.</p>;
    }

    if (!Array.isArray(albumEntries)) {
        console.error("albumEntries no es un arreglo:", albumEntries);
        return <p className="error">Error al cargar las entradas del álbum.</p>;
    }

    const handleUpdateAlbumEntries = async (albumId, updatedEntries) => {
        // Extraemos solo los IDs y sus posiciones para enviar al backend
        const entriesData = updatedEntries.map(entry => ({
            id: entry.id,
            position: entry.position,
        }));
        try {
            await updateAlbumEntries(modifyAlbum, albumId, entriesData);
            console.log("Entradas del álbum actualizadas correctamente");
        } catch (error) {
            console.error("Error al actualizar las entradas del álbum:", error);
        }
    };

    const handleEntryClick = (entry) => {
        if (!selectedAlbum) return;
        const isSelected = localAlbumEntries.some(albumEntry => albumEntry.id === entry.id);

        if (isSelected) {
            const updatedAlbumEntries = localAlbumEntries.filter(albumEntry => albumEntry.id !== entry.id);
            setLocalAlbumEntries(updatedAlbumEntries);
            handleUpdateAlbumEntries(selectedAlbum.id, updatedAlbumEntries);
        } else {
            if (localAlbumEntries.length >= 15) {
                alert("No puedes agregar más de 15 entradas a un álbum.");
                return;
            }
            const newEntry = {
                ...entry,
                position: { x: 0, y: 0 }, // Posición inicial
            };
            const updatedAlbumEntries = [...localAlbumEntries, newEntry];
            setLocalAlbumEntries(updatedAlbumEntries);
            handleUpdateAlbumEntries(selectedAlbum.id, updatedAlbumEntries);
        }
    };

    const handleBackgroundChange = async (e) => {
        if (!selectedAlbum) return;
        const newColor = e.target.value;
        setAlbumBackground(newColor);
        await modifyAlbum(selectedAlbum.id, { backgroundColor: newColor });
    };

    const handleCreateAlbum = async (albumName, beneficiarioId) => {
        if (albumName.trim() === '' || beneficiarioId === '') return;
        try {
            await addAlbum(albumName, '#ffffff', beneficiarioId);
            setNewAlbumName('');
            setActiveOption(null);
        } catch (error) {
            console.error("Error al crear álbum:", error);
        }
    };

    const handleDeleteAlbum = async (albumId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este álbum?")) {
            try {
                await removeAlbum(albumId);
                if (selectedAlbum && selectedAlbum.id === albumId) {
                    const remainingAlbums = albums.filter(album => album.id !== albumId);
                    setSelectedAlbum(remainingAlbums.length > 0 ? remainingAlbums[0] : null);
                }
            } catch (error) {
                console.error("Error al eliminar álbum:", error);
            }
        }
    };

    const handleOptionClick = (option) => {
        if (activeOption === option) {
            setActiveOption(null);
        } else {
            setActiveOption(option);
        }
    };

    const handleAlbumSelect = (album) => {
        setSelectedAlbum(album);
        setActiveOption(null);
    };

    const renderContent = () => {
        switch (activeOption) {
            case 'crearAlbum':
                return (
                    <CreateAlbum onCreate={handleCreateAlbum} />
                );
            case 'listarAlbums':
                return (
                    <ListAlbums albums={albums} onDelete={handleDeleteAlbum} />
                );
            case 'tusAlbums':
                return (
                    <SelectedAlbum albums={albums} onSelect={handleAlbumSelect} />
                );
            default:
                return null;
        }
    };

    const handleDragEnd = (event) => {
        const { active, delta } = event;
        const entryId = active.id;

        console.log(`Moviendo entrada ${entryId} por delta:`, delta);

        setLocalAlbumEntries((entries) => {
            const updatedEntries = entries.map(entry => {
                if (entry.id === entryId) {
                    const newX = entry.position.x + delta.x;
                    const newY = entry.position.y + delta.y;
                    console.log(`Nueva posición para ${entryId}: x=${newX}, y=${newY}`);
                    return {
                        ...entry,
                        position: { x: newX, y: newY },
                    };
                }
                return entry;
            });
            // Actualizamos el backend con las nuevas posiciones
            handleUpdateAlbumEntries(selectedAlbum.id, updatedEntries);
            return updatedEntries;
        });
    };

    // Función para eliminar una entrada
    const handleDeleteEntry = async (entryId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta entrada?")) {
            const updatedEntries = localAlbumEntries.filter(entry => entry.id !== entryId);
            setLocalAlbumEntries(updatedEntries);
            await handleUpdateAlbumEntries(selectedAlbum.id, updatedEntries);
        }
    };

    // Componente para el contenedor droppable
    const DroppableContainer = ({ children }) => {
        const { setNodeRef } = useDroppable({
            id: 'droppable-container',
        });

        return (
            <div
                ref={setNodeRef}
                className="droppable-container"
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '80vh',
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: albumBackground || '#ffffff',
                }}
            >
                {children}
            </div>
        );
    };

    // Componente para cada entrada draggable
    const DraggableEntry = ({ entry }) => {
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useDraggable({
            id: entry.id.toString(),
        });

        const style = {
            transform: CSS.Translate.toString(transform),
            transition,
            position: 'absolute',
            top: 0,
            left: 0,
            cursor: 'grab',
            opacity: isDragging ? 0.5 : 1,
        };

        return (
            <div
                ref={setNodeRef}
                style={{ ...style, ...entry.position }}
                {...attributes}
                {...listeners}
                className="draggable-entry"
            >
                <div className="entry-content">
                    <p>{entry.texto || 'Entrada sin texto'}</p>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEntry(entry.id);
                        }}
                        className="delete-button"
                        aria-label="Eliminar entrada"
                    >
                        &times;
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="album-layout">
            {/* Menú Lateral Izquierdo */}
            <SideMenu
                isExpanded={isMenuExpanded}
                toggleMenu={() => setIsMenuExpanded(!isMenuExpanded)}
                activeOption={activeOption}
                handleOptionClick={handleOptionClick}
            />

            {/* Contenedor de Opciones Activas */}
            {activeOption && (
                <div className={`options-container ${isMenuExpanded ? 'expanded' : 'collapsed'}`}>
                    {renderContent()}
                </div>
            )}

            {/* Contenido Principal */}
            <div className="main-content">
                {selectedAlbum ? (
                    <>
                        <div className="album-manager">
                            <div className="album-header">
                                <h2>{selectedAlbum.name}</h2>
                                <div className="album-actions">
                                    <label htmlFor="bg-color">Color de Fondo:</label>
                                    <input
                                        type="color"
                                        id="bg-color"
                                        value={albumBackground}
                                        onChange={handleBackgroundChange}
                                        className="color-picker"
                                    />
                                </div>
                            </div>
                            <p className="entry-count">{localAlbumEntries.length}/15</p>

                            {/* Implementación de @dnd-kit para diseño libre */}
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <DroppableContainer>
                                    {localAlbumEntries.map((entry) => (
                                        <DraggableEntry key={entry.id} entry={entry} />
                                    ))}
                                </DroppableContainer>
                            </DndContext>
                        </div>
                        <div className="entries-section">
                            <EntriesManager
                                entries={entries}
                                albumEntries={localAlbumEntries}
                                onEntryClick={handleEntryClick}
                            />
                        </div>
                    </>
                ) : (
                    <p className="select-album-message">Selecciona un álbum para comenzar.</p>
                )}
            </div>
        </div>
    );
};

export default Album;
