import React from 'react';
import Album from './album';
import './AlbumPage.css';
import { useAuth } from '../auth/authContext';

const AlbumPage = () => {
    const { currentUser } = useAuth();
    return (
        <div className="main">
            <div className='AlbumCard'>
                <Album />
            </div>
        </div>
    );
};

export default AlbumPage;
