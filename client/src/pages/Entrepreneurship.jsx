import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { MdMenuBook, MdAssessment, MdLibraryBooks } from 'react-icons/md';
import './Entrepreneurship.css';


const Entrepreneurship = () => {
  const [contents, setContents] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchContents = async () => {
      try {
        setLoading(true);
        setError('');
        
        if (selectedType === 'book') {
          // Fetch books from library with entrepreneurship category
          const response = await axios.get(`${API_URL}/books`, { params: { category: 'entrepreneurship' } });
          setBooks(response.data);
          setContents([]);
        } else {
          const params = {};
          if (selectedType) params.type = selectedType;
          
          const response = await axios.get(`${API_URL}/entrepreneurship`, { params });
          setContents(response.data);
          setBooks([]);
        }
      } catch (error) {
        console.error('Error fetching contents:', error);
        setError('Impossible de charger le contenu entrepreneurial.');
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [selectedType]);

  const iconForType = (type) => {
    if (type === 'lesson') return <MdMenuBook size={36} />;
    if (type === 'case_study') return <MdAssessment size={36} />;
    return <MdLibraryBooks size={36} />;
  };

  return (
    <div className="entrepreneurship-page">
      <div className="container">
        <div className="page-header">
          <h1>Entrepreneuriat</h1>
          <p>Devenez les futurs leaders de la RDC et de l'Afrique</p>
        </div>
        {error && <div className="alert error-alert">{error}</div>}

        <div className="categories">
          <button
            className={`category-btn ${selectedType === '' ? 'active' : ''}`}
            onClick={() => setSelectedType('')}
          >
            Tous
          </button>
          <button
            className={`category-btn ${selectedType === 'lesson' ? 'active' : ''}`}
            onClick={() => setSelectedType('lesson')}
          >
            Leçons
          </button>
          <button
            className={`category-btn ${selectedType === 'case_study' ? 'active' : ''}`}
            onClick={() => setSelectedType('case_study')}
          >
            Études de Cas
          </button>
          <button
            className={`category-btn ${selectedType === 'book' ? 'active' : ''}`}
            onClick={() => setSelectedType('book')}
          >
            Livres
          </button>
        </div>

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (selectedType === 'book' && books.length === 0) || (selectedType !== 'book' && contents.length === 0) ? (
          <div className="no-contents">
            <p>Aucun contenu disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid">
            {selectedType === 'book' ? (
              books.map((book) => (
                <div key={book.id} className="content-card">
                  <div className="content-icon">
                    <MdLibraryBooks size={36} />
                  </div>
                  <h3>{book.title}</h3>
                  {book.author && <p className="content-description">Par {book.author}</p>}
                  {book.description && (
                    <div className="content-text">
                      <p>{book.description}</p>
                    </div>
                  )}
                  <button
                    onClick={() => navigate(`/book/${book.id}`)}
                    className="btn btn-primary"
                  >
                    Voir le livre
                  </button>
                </div>
              ))
            ) : (
              contents.map((content) => (
                <div key={content.id} className="content-card">
                  <div className="content-icon">
                    {iconForType(content.type)}
                  </div>
                  <h3>{content.title}</h3>
                  {content.description && (
                    <p className="content-description">{content.description}</p>
                  )}
                  {content.content && (
                    <div className="content-text">
                      <p>{content.content}</p>
                    </div>
                  )}
                  {content.file_url && (
                    <a
                      href={`${API_URL.replace('/api', '')}${content.file_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Voir le contenu
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        <div className="info-section">
          <div className="card">
            <h2>Votre avenir entrepreneurial</h2>
            <p>
              L'entrepreneuriat est une voie puissante vers l'autonomie et le développement. 
              Ces ressources vous fournissent des connaissances et l'inspiration pour créer votre propre activité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entrepreneurship;

