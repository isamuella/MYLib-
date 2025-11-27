const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query } = require('../db/database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../uploads/mental-health');
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

// Get all mental health resources (public)
router.get('/', async (req, res) => {
  const { type } = req.query;
  try {
    let sql = 'SELECT * FROM mental_health_resources WHERE 1=1';
    const params = [];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    sql += ' ORDER BY created_at DESC';

    const resources = await query(sql, params);
    const resourcesWithUrls = resources.map(resource => ({
      ...resource,
      file_url: resource.file_path ? `/uploads/mental-health/${path.basename(resource.file_path)}` : null
    }));

    res.json(resourcesWithUrls);
  } catch (error) {
    console.error('List mental health resources error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des ressources' });
  }
});

// Get resource by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const rows = await query('SELECT * FROM mental_health_resources WHERE id = ?', [id]);
    const resource = rows[0];

    if (!resource) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }

    res.json({
      ...resource,
      file_url: resource.file_path ? `/uploads/mental-health/${path.basename(resource.file_path)}` : null
    });
  } catch (error) {
    console.error('Get mental health resource error:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

// Create mental health resource (Teacher/Admin only)
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
        'INSERT INTO mental_health_resources (title, type, content, file_path, description) VALUES (?, ?, ?, ?, ?)',
        [title, type, content || null, filePath, description || null]
      );

      res.status(201).json({
        message: 'Ressource créée avec succès',
        resource: {
          id: result.insertId,
          title,
          type,
          file_url: filePath ? `/uploads/mental-health/${path.basename(filePath)}` : null
        }
      });
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      console.error('Create mental resource error:', error);
      res.status(500).json({ message: 'Erreur lors de la création de la ressource' });
    }
  }
);

// Delete resource (Admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const rows = await query('SELECT file_path FROM mental_health_resources WHERE id = ?', [id]);
    const resource = rows[0];

    if (!resource) {
      return res.status(404).json({ message: 'Ressource non trouvée' });
    }

    await query('DELETE FROM mental_health_resources WHERE id = ?', [id]);

    if (resource.file_path && fs.existsSync(resource.file_path)) {
      fs.unlinkSync(resource.file_path);
    }

    res.json({ message: 'Ressource supprimée avec succès' });
  } catch (error) {
    console.error('Delete mental resource error:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

module.exports = router;

