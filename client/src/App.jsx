import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Library from './pages/Library';
import BookDetail from './pages/BookDetail';
import MentalHealth from './pages/MentalHealth';
import Entrepreneurship from './pages/Entrepreneurship';
import AdminPanel from './pages/AdminPanel';
import UploadBook from './pages/UploadBook';
import Unauthorized from './pages/Unauthorized';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
    <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/library" element={<Library />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/mental-health" element={<MentalHealth />} />
            <Route path="/entrepreneurship" element={<Entrepreneurship />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminPanel />
                </PrivateRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <PrivateRoute allowedRoles={['admin', 'teacher']}>
                  <UploadBook />
                </PrivateRoute>
              }
            />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
    </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
