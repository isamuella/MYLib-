import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import './AdminPanel.css';


const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'student' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/register`, newUser);
      setMessage('Utilisateur créé avec succès');
      setNewUser({ username: '', password: '', role: 'student' });
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de la création');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container">
        <div className="card">
          <h2>Accès refusé</h2>
          <p>Cette page est réservée aux administrateurs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="container">
        <div className="page-header">
          <h1>Panneau d'Administration</h1>
          <p>Gérer les utilisateurs et le système</p>
        </div>

        <div className="admin-section">
          <div className="card">
            <h2>Créer un nouvel utilisateur</h2>
            {message && (
              <div className={`message ${message.includes('succès') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Nom d'utilisateur</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mot de passe</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label>Rôle</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="student">Étudiant</option>
                  <option value="teacher">Enseignant</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                Créer l'utilisateur
              </button>
            </form>
          </div>

          <div className="card">
            <h2>Liste des utilisateurs</h2>
            {loading ? (
              <p>Chargement...</p>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom d'utilisateur</th>
                    <th>Rôle</th>
                    <th>Date de création</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.username}</td>
                      <td>
                        <span className={`role-badge role-${u.role}`}>
                          {u.role === 'admin' ? 'Administrateur' : 
                           u.role === 'teacher' ? 'Enseignant' : 'Étudiant'}
                        </span>
                      </td>
                      <td>{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

