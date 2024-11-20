import React from 'react';
import { useAuth } from '../page/auth/authContext'; // Hook para obtener el usuario autenticado
import useEntries from './entry/useEntries';
import EntriesManager from './entry/entry';
import './Prueba.css';

const Prueba = () => {
    const { currentUser } = useAuth(); // Obtén el usuario autenticado
    const { entries, loading } = useEntries(currentUser); // Usa las entradas del usuario

    if (loading) {
        return <div>Cargando entradas...</div>;
    }

    return (
        <div className="testing-page">
            <h1>Ambiente de Pruebas</h1>
            <EntriesManager
                entries={entries}
                albumEntries={[]} // Puedes dejar esto vacío ya que no lo estás usando
                onEntryClick={(entry) => console.log('Entrada seleccionada:', entry)}
            />
        </div>
    );
};

export default Prueba;
