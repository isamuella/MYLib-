import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          MYLib
        </Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/library" className="nav-link">Bibliothèque</Link>
          <Link to="/mental-health" className="nav-link">Santé Mentale</Link>
          <Link to="/entrepreneurship" className="nav-link">Entrepreneuriat</Link>
          {user && (user.role === 'admin' || user.role === 'teacher') && (
            <Link to="/upload" className="nav-link">Téléverser</Link>
          )}
          {user && user.role === 'admin' && (
            <Link to="/admin" className="nav-link">Admin</Link>
          )}
          {user ? (
            <div className="nav-user">
              <span className="nav-username">{user.username}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Déconnexion
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">Connexion</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

