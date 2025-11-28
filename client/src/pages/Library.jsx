import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { MdMenuBook, MdDownload } from 'react-icons/md';
import './Library.css';


const Library = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError('');
        const params = {};
        if (selectedCategory) params.category = selectedCategory;
        
        const response = await axios.get(`${API_URL}/books`, { params });
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
        setError('Impossible de charger les livres. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [selectedCategory]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      
      const response = await axios.get(`${API_URL}/books`, { params });
      setBooks(response.data);
    } catch (error) {
      console.error('Error searching books:', error);
      setError('La recherche a échoué. Réessayez plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const displayBooks = searchTerm ? filteredBooks : books;

  return (
    <div className="library-page">
      <div className="container">
        <div className="page-header">
          <h1>Bibliothèque</h1>
          <p>Explorez notre collection de livres éducatifs</p>
          <p className="offline-note">Astuce : téléchargez les livres pour les lire hors ligne pendant 7 jours.</p>
        </div>
        {error && <div className="alert error-alert">{error}</div>}

        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un livre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="btn btn-primary">
            Rechercher
          </button>
        </div>

        <div className="categories">
          <button
            className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            Tous
          </button>
          <button
            className={`category-btn ${selectedCategory === 'education' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('education')}
          >
            Éducation
          </button>
          <button
            className={`category-btn ${selectedCategory === 'mental_health' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('mental_health')}
          >
            Santé Mentale
          </button>
          <button
            className={`category-btn ${selectedCategory === 'entrepreneurship' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('entrepreneurship')}
          >
            Entrepreneuriat
          </button>
        </div>

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : displayBooks.length === 0 ? (
          <div className="no-books">
            <p>Aucun livre trouvé.</p>
          </div>
        ) : (
          <div className="grid">
            {displayBooks.map((book) => (
              <div
                key={book.id}
                className="book-card"
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <div className="book-icon"><MdMenuBook size={36} /></div>
                <h3>{book.title}</h3>
                {book.author && <p className="book-author">Par {book.author}</p>}
                {book.description && (
                  <p className="book-description">{book.description.substring(0, 100)}...</p>
                )}
                <div className="book-meta">
                  <span className="book-category">{book.category}</span>
                  {book.download_count > 0 && (
                    <span className="book-downloads"><MdDownload size={16} style={{ verticalAlign: 'middle' }} /> {book.download_count}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;

