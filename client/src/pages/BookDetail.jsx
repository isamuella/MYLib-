import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';
import { Document, Page, pdfjs } from 'react-pdf';
import { MdArrowBack, MdDownload, MdMenuBook, MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import './BookDetail.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [viewMode, setViewMode] = useState('info'); 

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${API_URL}/books/${id}`);
        const bookData = response.data;
        setBook(bookData);
        // Use full URL for PDF viewing
        const fullUrl = bookData.file_url.startsWith('http') 
          ? bookData.file_url 
          : `${window.location.protocol}//${window.location.hostname}:5000${bookData.file_url}`;
        setDownloadUrl(fullUrl);
        console.log('Book loaded. Download URL:', fullUrl);
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBook();
  }, [id]);

  const handleDownload = async () => {
    try {
      // Track download
      await axios.post(`${API_URL}/books/${id}/download`);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${book.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if ('serviceWorker' in navigator && 'indexedDB' in window) {
        const downloadInfo = {
          id: book.id,
          title: book.title,
          fileUrl: downloadUrl,
          downloadedAt: new Date().toISOString()
        };
        localStorage.setItem(`book_${book.id}`, JSON.stringify(downloadInfo));
      }
    } catch (error) {
      console.error('Error downloading book:', error);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    console.log('PDF loaded successfully:', numPages, 'pages');
  };

  const onDocumentLoadError = (error) => {
    console.error('PDF load error:', error);
  };

  if (loading) {
    return <div className="container">Chargement...</div>;
  }

  if (!book) {
    return (
      <div className="container">
        <div className="card">
          <p>Livre non trouvé</p>
          <button onClick={() => navigate('/library')} className="btn btn-primary">
            Retour à la bibliothèque
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-detail-page">
      <div className="container">
        <button onClick={() => navigate('/library')} className="btn btn-secondary back-btn">
          <MdArrowBack size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Retour
        </button>

        <div className="book-header">
          <div className="book-info">
            <h1>{book.title}</h1>
            {book.author && <p className="author">Par {book.author}</p>}
            {book.description && <p className="description">{book.description}</p>}
            <div className="book-details">
              <span className="category-badge">{book.category}</span>
              {book.file_size && (
                <span className="file-size">
                  {(book.file_size / (1024 * 1024)).toFixed(2)} MB
                </span>
              )}
            </div>
            <div className="book-actions">
              <button onClick={handleDownload} className="btn btn-primary">
                <MdDownload size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Télécharger
              </button>
              {downloadUrl && downloadUrl.endsWith('.pdf') && (
                <button
                  onClick={() => {
                    console.log('Toggle view mode. Current:', viewMode, 'Download URL:', downloadUrl);
                    setViewMode(viewMode === 'info' ? 'read' : 'info');
                  }}
                  className="btn btn-success"
                >
                  {viewMode === 'info' ? (
                    <>
                      <MdMenuBook size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Lire
                    </>
                  ) : (
                    <>← Retour aux informations</>
                  )}
                </button>
              )}
            </div>
            <p className="offline-note small-note">
              Après téléchargement, ce livre reste accessible hors ligne pendant 7 jours.
            </p>
          </div>
        </div>

        {viewMode === 'read' && downloadUrl && downloadUrl.endsWith('.pdf') && (
          <div className="pdf-viewer">
            <div className="pdf-controls">
              <button
                onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                disabled={pageNumber <= 1}
                className="btn btn-secondary"
              >
                <MdNavigateBefore size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Précédent
              </button>
              <span>
                Page {pageNumber} sur {numPages || '...'}
              </span>
              <button
                onClick={() => setPageNumber(Math.min(numPages || 1, pageNumber + 1))}
                disabled={pageNumber >= (numPages || 1)}
                className="btn btn-secondary"
              >
                Suivant <MdNavigateNext size={18} style={{ verticalAlign: 'middle', marginLeft: 6 }} />
              </button>
            </div>
            <div className="pdf-container">
              <Document
                file={downloadUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={<div>Chargement du PDF...</div>}
                error={<div>Erreur lors du chargement du PDF. Vérifiez la console pour plus de détails.</div>}
                options={{
                  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
                  cMapPacked: true,
                  standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
                  withCredentials: false,
                }}
              >
                <Page 
                  pageNumber={pageNumber} 
                  scale={1.5}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </Document>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;

