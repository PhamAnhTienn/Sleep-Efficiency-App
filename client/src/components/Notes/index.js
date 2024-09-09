import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [name, setName] = useState('');
  const [prediction, setPrediction] = useState('');
  const [note, setNote] = useState('');
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notes');
      setNotes(response.data);
    } catch (error) {
      setError('Failed to fetch notes');
    }
  };

  const handleCreateOrUpdateNote = async () => {
    try {
      const newNote = { name, prediction, note };
      if (editing) {
        await axios.put(`http://localhost:5000/api/notes/${name}`, newNote);
      } else {
        await axios.post('http://localhost:5000/api/notes', newNote);
      }
      fetchNotes();
      setName('');
      setPrediction('');
      setNote('');
      setEditing(false);
      setError('');
    } catch (error) {
      setError('Failed to save note');
    }
  };

  const handleEditNote = (note) => {
    setName(note.name);
    setPrediction(note.prediction);
    setNote(note.note);
    setEditing(true);
  };

  const handleDeleteNote = async (name) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${name}`);
      fetchNotes();
    } catch (error) {
      setError('Failed to delete note');
    }
  };

  return (
    <div className="notes-container">
      <h1>{editing ? 'Edit Note' : 'Create and View Notes'}</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="notes-content">
        <div className="note-form">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={editing}
          />
          <input
            type="text"
            placeholder="Prediction Result"
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
          />
          <textarea
            placeholder="Your Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
          <button onClick={handleCreateOrUpdateNote}>
            {editing ? 'Update Note' : 'Create Note'}
          </button>
        </div>
        <div className="notes-wrapper">
          <div className="notes-list">
            {notes.map((note) => (
              <div key={note.name} className="note-item">
                <h2>{note.name}</h2>
                <p>Prediction: {note.prediction}</p>
                <p>Note: {note.note}</p>
                <div className="note-actions">
                  <button className="edit-button" onClick={() => handleEditNote(note)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDeleteNote(note.name)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
