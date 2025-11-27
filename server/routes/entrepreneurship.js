const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query } = require('../db/database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../uploads/entrepreneurship');
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

const upload = multer({ storage: storage });

// Get all entrepreneurship content (public)
router.get('/', async (req, res) => {
  const { type } = req.query;
  try {
    let sql = 'SELECT * FROM entrepreneurship_content WHERE 1=1';
    const params = [];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    sql += ' ORDER BY created_at DESC';

    const contents = await query(sql, params);
    const contentsWithUrls = contents.map(content => ({
      ...content,
      file_url: content.file_path ? `/uploads/entrepreneurship/${path.basename(content.file_path)}` : null
    }));

    res.json(contentsWithUrls);
  } catch (error) {
    console.error('List entrepreneurship content error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du contenu' });
  }
});

// Get content by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await query('SELECT * FROM entrepreneurship_content WHERE id = ?', [id]);
    const content = rows[0];

    if (!content) {
      return res.status(404).json({ message: 'Contenu non trouvé' });
    }

    res.json({
      ...content,
      file_url: content.file_path ? `/uploads/entrepreneurship/${path.basename(content.file_path)}` : null
    });
  } catch (error) {
    console.error('Get entrepreneurship content error:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Create entrepreneurship content (Teacher/Admin only)
router.post(
  '/',
  authenticate,
  authorize('admin', 'teacher'),
  upload.single('file'),
  async (req, res) => {
    const { title, type, content, description } = req.body;

    if (!title || !type) {
      return res.status(400).json({ message: 'Titre et type sont requis' });
    }

    const filePath = req.file ? req.file.path : null;

    try {
      const result = await query(
        'INSERT INTO entrepreneurship_content (title, type, content, file_path, description) VALUES (?, ?, ?, ?, ?)',
        [title, type, content || null, filePath, description || null]
      );

      res.status(201).json({
        message: 'Contenu créé avec succès',
        content: {
          id: result.insertId,
          title,
          type,
          file_url: filePath ? `/uploads/entrepreneurship/${path.basename(filePath)}` : null
        }
      });
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      console.error('Create entrepreneurship content error:', error);
      res.status(500).json({ message: 'Erreur lors de la création du contenu' });
    }
  }
);

// Delete content (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const rows = await query('SELECT file_path FROM entrepreneurship_content WHERE id = ?', [id]);
    const content = rows[0];

    if (!content) {
      return res.status(404).json({ message: 'Contenu non trouvé' });
    }

    await query('DELETE FROM entrepreneurship_content WHERE id = ?', [id]);

    if (content.file_path && fs.existsSync(content.file_path)) {
      fs.unlinkSync(content.file_path);
    }

    res.json({ message: 'Contenu supprimé avec succès' });
  } catch (error) {
    console.error('Delete entrepreneurship content error:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

module.exports = router;

