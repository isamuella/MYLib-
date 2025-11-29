require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { init } = require('./db/database');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const mentalHealthRoutes = require('./routes/mentalHealth');
const entrepreneurshipRoutes = require('./routes/entrepreneurship');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Global error handlers (log clearer info)
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection at:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // let nodemon restart the app
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://mylib-frontend.netlify.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files with proper headers for PDFs
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'MYLib API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/mental-health', mentalHealthRoutes);
app.use('/api/entrepreneurship', entrepreneurshipRoutes);
app.use('/api/users', userRoutes);

// Start sequence with try/catch so errors are logged before nodemon restarts
(async function start() {
  try {
    await init();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
})();

