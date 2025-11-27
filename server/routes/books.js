const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query } = require('../db/database');
const jwt = require('jsonwebtoken');
const { authenticate, authorize, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../uploads/books');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.epub', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Utilisez PDF, EPUB ou TXT.'));
    }
  }
});

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let sql = 'SELECT * FROM books WHERE 1=1';
    const params = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (title LIKE ? OR author LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY created_at DESC';

    const books = await query(sql, params);
    const booksWithUrls = books.map(book => ({
      ...book,
      file_url: `/uploads/books/${path.basename(book.file_path)}`,
      cover_image_url: book.cover_image ? `/uploads/covers/${path.basename(book.cover_image)}` : null
    }));

    res.json(booksWithUrls);
  } catch (error) {
    console.error('List books error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des livres' });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const books = await query('SELECT * FROM books WHERE id = ?', [id]);
    const book = books[0];

    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    res.json({
      ...book,
      file_url: `/uploads/books/${path.basename(book.file_path)}`,
      cover_image_url: book.cover_image ? `/uploads/covers/${path.basename(book.cover_image)}` : null
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Upload book (Teacher/Admin only)
router.post(
  '/',
  authenticate,
  authorize('admin', 'teacher'),
  upload.single('file'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'Fichier requis' });
    }

    const { title, author, category, description } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: 'Titre et catégorie sont requis' });
    }

    try {
      const result = await query(
        'INSERT INTO books (title, author, category, description, file_path, file_size, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, author || null, category, description || null, req.file.path, req.file.size, req.user.id]
      );

      res.status(201).json({
        message: 'Livre uploadé avec succès',
        book: {
          id: result.insertId,
          title,
          author,
          category,
          file_url: `/uploads/books/${path.basename(req.file.path)}`
        }
      });
    } catch (error) {
      fs.unlinkSync(req.file.path);
      console.error('Upload book error:', error);
      res.status(500).json({ message: 'Erreur lors de l\'upload du livre' });
    }
  }
);

// Delete book (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const rows = await query('SELECT file_path FROM books WHERE id = ?', [id]);
    const book = rows[0];

    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    await query('DELETE FROM books WHERE id = ?', [id]);

    if (book.file_path && fs.existsSync(book.file_path)) {
      fs.unlinkSync(book.file_path);
    }

    res.json({ message: 'Livre supprimé avec succès' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

// Track download
router.post('/:id/download', async (req, res) => {
  const { id } = req.params;
  let userId = null;

  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      // continue without userId
    }
  }

  try {
    await query('UPDATE books SET download_count = download_count + 1 WHERE id = ?', [id]);

    if (userId) {
      await query('INSERT INTO downloads (user_id, book_id) VALUES (?, ?)', [userId, id]);
    }

    res.json({ message: 'Téléchargement enregistré' });
  } catch (error) {
    console.error('Download tracking error:', error);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement du téléchargement' });
  }
});

module.exports = router;

