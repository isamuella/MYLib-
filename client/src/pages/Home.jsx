import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdMenuBook, MdPsychology, MdRocketLaunch } from 'react-icons/md';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <div className="hero-section">
        <div className="container">
          <h1>Bienvenue sur MYLib</h1>
          <p className="hero-subtitle">
            Votre bibliothèque numérique pour l'éducation, la santé mentale et l'entrepreneuriat
          </p>
          <div className="hero-buttons">
            <Link to="/library" className="btn btn-primary btn-large">
              Explorer la Bibliothèque
            </Link>
            {!user && (
              <Link to="/login" className="btn btn-secondary btn-large">
                Se Connecter
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2>Fonctionnalités</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><MdMenuBook size={48} /></div>
              <h3>Bibliothèque Numérique</h3>
              <p>Accédez à des livres éducatifs, téléchargez-les et lisez-les même sans internet.</p>
              <Link to="/library" className="btn btn-primary">Explorer</Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><MdPsychology size={48} /></div>
              <h3>Santé Mentale</h3>
              <p>Exercices de relaxation, histoires inspirantes et ressources pour le bien-être.</p>
              <Link to="/mental-health" className="btn btn-primary">Découvrir</Link>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><MdRocketLaunch size={48} /></div>
              <h3>Entrepreneuriat</h3>
              <p>Leçons, études de cas et livres pour devenir les futurs leaders.</p>
              <Link to="/entrepreneurship" className="btn btn-primary">Apprendre</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="container">
          <div className="info-card">
            <h2>À propos de MYLib</h2>
            <p>
              MYLib est conçu pour fournir des installations et systèmes éducatifs aux enfants 
              de la République Démocratique du Congo. Notre mission est de donner accès à 
              l'éducation, aux ressources de santé mentale et au contenu entrepreneurial.
            </p>
            <p>
              L'application fonctionne hors ligne après le téléchargement, permettant un accès 
              continu même dans des zones avec une connectivité internet limitée.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

