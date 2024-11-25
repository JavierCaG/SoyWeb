// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar/navBar';
import Home from './page/home/home'
import Prueba from './page/prueba';
import AlbumPage from './page/album/pageAlbum';
import DocumentManager from './page/organizes/pageOrganize';
import LoginPage from './page/auth/login';
import RegisterPage from './page/auth/register';
import ProtectedRoute from './components/protectedRoute';
import { AuthProvider } from './page/auth/authContext'; // Importa el AuthProvider
import "./App.css";

const ProtectedLayout = ({ children }) => (
  <div className="protected-layout">
    <Navbar />
    {children}
  </div>
);

function App() {
  return (
    <AuthProvider> {/* Envuelve toda la aplicación con AuthProvider */}
      <Router>
        <Routes>
          {/* Rutas de autenticación sin Navbar */}
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />

          {/* Ruta protegida para Home envuelta en ProtectedLayout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Home />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/prueba"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Prueba />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/album"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <AlbumPage />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/organize"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <DocumentManager />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
