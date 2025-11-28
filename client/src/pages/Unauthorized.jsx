import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div className="unauthorized-page">
      <div className="container">
        <div className="card">
          <h1>Accès refusé</h1>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          {message && <p className="unauthorized-note">{message}</p>}
          <div className="unauthorized-actions">
            <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
            <Link to="/login" className="btn btn-secondary">Changer de profil</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;