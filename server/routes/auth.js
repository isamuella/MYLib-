const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { query } = require('../db/database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Le nom d\'utilisateur est requis'),
    body('password').notEmpty().withMessage('Le mot de passe est requis')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const results = await query('SELECT * FROM users WHERE username = ?', [username]);
      const user = results[0];

      if (!user) {
        return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Erreur du serveur' });
    }
  }
);

router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Le nom d\'utilisateur est requis'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('role').isIn(['admin', 'teacher', 'student']).withMessage('Rôle invalide')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, role } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [
        username,
        hashedPassword,
        role
      ]);

      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: {
          username,
          role
        }
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Ce nom d\'utilisateur existe déjà' });
      }
      console.error('Register error:', error);
      res.status(500).json({ message: 'Erreur du serveur' });
    }
  }
);

module.exports = router;

