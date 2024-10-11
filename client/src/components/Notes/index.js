import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

export default function ModernNotes() {
  const [notes, setNotes] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    prediction: '',
    note: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://54.81.174.105:8080/api/notes');
      setNotes(response.data);
    } catch (err) {
      setError('Failed to fetch notes. Please try again later.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://54.81.174.105:8080/api/notes/${editingId}`, formData);
      } else {
        await axios.post('http://54.81.174.105:8080/api/notes', formData);
      }
      fetchNotes();
      resetForm();
    } catch (err) {
      setError(editingId ? 'Failed to update note.' : 'Failed to create note.');
    }
  };

  const handleDelete = async (name) => {
    try {
      await axios.delete(`http://54.81.174.105:8080/api/notes/${name}`);
      fetchNotes();
    } catch (err) {
      setError('Failed to delete note.');
    }
  };

  const startEdit = (note) => {
    setFormData({ name: note.name, prediction: note.prediction, note: note.note });
    setEditingId(note.name);
    setIsCreating(true);
  };

  const resetForm = () => {
    setFormData({ name: '', prediction: '', note: '' });
    setEditingId(null);
    setIsCreating(false);
    setError('');
  };

  return (
    <div className="notes-app-container">
      <div className="notes-header">
        <h1>Sleep Notes Board</h1>
        <p className="subtitle">Share your thoughts and predictions with everyone</p>
      </div>

      <div className="notes-content">
        <div className="create-note-section">
          {error && (
            <div className="error-alert">
              {error}
            </div>
          )}

          <div className={`note-card ${isCreating ? 'expanded' : ''}`}>
            <div className="note-card-header">
              <h2>{editingId ? 'Edit Note' : 'Create Note'}</h2>
              {isCreating && (
                <button onClick={resetForm} className="icon-button">
                  ×
                </button>
              )}
            </div>
            <div className="note-card-content">
              {!isCreating ? (
                <button
                  onClick={() => setIsCreating(true)}
                  className="create-button"
                >
                  + Add a new note
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="note-form">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={editingId}
                  />
                  <input
                    type="text"
                    placeholder="Prediction"
                    value={formData.prediction}
                    onChange={(e) => setFormData({...formData, prediction: e.target.value})}
                  />
                  <textarea
                    placeholder="Your Note"
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                  />
                  <div className="form-actions">
                    <button type="submit" className="submit-button">
                      {editingId ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="notes-list-section">
          <div className="notes-grid">
            {notes.map((note) => (
              <div key={note.name} className="note-card">
                <div className="note-card-header">
                  <h2>{note.name}</h2>
                  <div className="note-actions">
                    <button
                      onClick={() => startEdit(note)}
                      className="icon-button"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(note.name)}
                      className="icon-button delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="note-card-content">
                  <div className="note-section">
                    <label>Prediction</label>
                    <p>{note.prediction}</p>
                  </div>
                  <div className="note-section">
                    <label>Note</label>
                    <p>{note.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}