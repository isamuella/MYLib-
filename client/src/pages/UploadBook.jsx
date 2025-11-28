import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import './UploadBook.css';


const UploadBook = () => {
  useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'education',
    description: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setMessage('Veuillez sélectionner un fichier');
      return;
    }

    setLoading(true);
    setMessage('');

    const data = new FormData();
    data.append('file', file);
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('category', formData.category);
    data.append('description', formData.description);

    try {
      await axios.post(`${API_URL}/books`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setMessage('Livre uploadé avec succès!');
      setTimeout(() => {
        navigate('/library');
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de l\'upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="container">
        <div className="page-header">
          <h1>Téléverser un livre</h1>
          <p>Ajoutez un nouveau livre à la bibliothèque</p>
        </div>

        <div className="upload-card">
          {message && (
            <div className={`message ${message.includes('succès') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Titre *</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Titre du livre"
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Auteur</label>
              <input
                type="text"
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Nom de l'auteur"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Catégorie *</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="education">Éducation</option>
                <option value="mental_health">Santé Mentale</option>
                <option value="entrepreneurship">Entrepreneuriat</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                placeholder="Description du livre"
              />
            </div>

            <div className="form-group">
              <label htmlFor="file">Fichier * (PDF, EPUB, TXT - Max 50MB)</label>
              <input
                type="file"
                id="file"
                accept=".pdf,.epub,.txt"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
              {file && (
                <p className="file-info">
                  Fichier sélectionné: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Téléversement...' : 'Téléverser le livre'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/library')}
                className="btn btn-secondary"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadBook;

