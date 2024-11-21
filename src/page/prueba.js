import React, { useContext } from 'react';
import EntriesManager from './entry/entry';  // Asegúrate de importar correctamente el componente
import useEntries from './entry/useEntries'; // Asegúrate de que la ruta sea correcta
import { useAuth } from './auth/authContext'; // Asegúrate de tener este contexto configurado

const Pruebas = () => {
    // Obtener el usuario autenticado desde el contexto de autenticación
    const { currentUser } = useAuth();

    // Verifica si hay un usuario autenticado
    if (!currentUser) {
        return <p>No estás autenticado. Inicia sesión para continuar.</p>;
    }

    // Simula un álbum seleccionado (puedes ajustar este valor según lo necesites)
    const selectedAlbum = { id: 'album1', name: 'Mi Álbum' }; // Simula un álbum seleccionado

    // Llama al hook useEntries para obtener las entradas
    const { entries, albumEntries, albumBackground, loading, updateAlbumEntries } = useEntries(currentUser, selectedAlbum);

    // Función de manejo de clics en las entradas
    const handleEntryClick = (entry) => {
        console.log('Entrada seleccionada:', entry);
        // Simula una actualización de las entradas en el álbum
        updateAlbumEntries(selectedAlbum.id, [...albumEntries.map(ae => ae.id), entry.id]);
    };

    if (loading) {
        return <p>Cargando...</p>;
    }

    return (
        <div className="test-container">
            <h1>Prueba de EntriesManager</h1>
            <div style={{ backgroundColor: albumBackground }}>
                <EntriesManager
                    entries={entries}
                    albumEntries={albumEntries}
                    onEntryClick={handleEntryClick}
                />
            </div>
        </div>
    );
};

export default Pruebas;
