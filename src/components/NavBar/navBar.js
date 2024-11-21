// src/components/Navbar.js

import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link, useNavigate } from 'react-router-dom';
import { signOutUser } from '../../firebase';
import './Navbar.css';

const Navbar = () => {
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOutUser();
            console.log("Cerrando sesión...");
            navigate("/auth/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const controlNavbar = () => {
        if (typeof window !== 'undefined') {
            if (window.scrollY > lastScrollY && window.scrollY > 50) {
                // Si el desplazamiento actual es mayor que el anterior y ha pasado 50px, ocultamos el navbar
                setShowNavbar(false);
            } else {
                // Si el usuario se desplaza hacia arriba, mostramos el navbar
                setShowNavbar(true);
            }
            setLastScrollY(window.scrollY);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar);

            // Cleanup del event listener
            return () => {
                window.removeEventListener('scroll', controlNavbar);
            };
        }
    }, [lastScrollY]);

    return (
        <nav className={`navbar ${showNavbar ? '' : 'navbar--hidden'}`}>
            {/* Logo a la izquierda */}
            <Link to="/" smooth={true} duration={500} className="navbar-brand">
                Soy
            </Link>

            {/* Enlaces centrales */}
            <div className="navbar-center">
                <Link to="/prueba" smooth={true} duration={500}>Pruebas</Link>
                <ScrollLink to="historia" smooth={true} duration={500}>Historia de vida</ScrollLink>
                <Link to="/album" smooth={true} duration={500}>Tu álbum</Link>
                <ScrollLink to="ordena" smooth={true} duration={500}>Ordena tu vida</ScrollLink>
            </div>

            {/* Acciones a la derecha */}
            <div className="navbar-actions">
                <ScrollLink to="perfil" smooth={true} duration={500}>Perfil</ScrollLink>
                <button onClick={handleLogout} className="logout-button">
                    Cerrar sesión
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
