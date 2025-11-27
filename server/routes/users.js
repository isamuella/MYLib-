const express = require('express');
const { query } = require('../db/database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const users = await query('SELECT id, username, role, created_at FROM users');
    res.json(users);
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const rows = await query('SELECT id, username, role, created_at FROM users WHERE id = ?', [req.user.id]);
    const user = rows[0];
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Erreur du serveur' });
  }
});

module.exports = router;

