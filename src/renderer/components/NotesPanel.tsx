import React, { useState } from 'react';

interface Note {
  id: string;
  text: string;
  timestamp: number;
}

interface NotesPanelProps {
  notes: Note[];
  onAddNote: (text: string) => void;
  onDeleteNote: (id: string) => void;
}

const NotesPanel: React.FC<NotesPanelProps> = ({ notes, onAddNote, onDeleteNote }) => {
  const [newNoteText, setNewNoteText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNoteText.trim()) {
      onAddNote(newNoteText.trim());
      setNewNoteText('');
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Notes & Reminders</h2>
        <form onSubmit={handleSubmit} className="add-note-form">
          <input
            type="text"
            className="add-note-input"
            placeholder="Add a note..."
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
          />
          <button type="submit" className="btn">Add</button>
        </form>
      </div>
      <div className="notes-list">
        {notes.length === 0 ? (
          <div className="empty-state">
            <p>No notes yet. Add your first note above!</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="note-item">
              <span className="note-bullet">•</span>
              <div className="note-content">
                <span className="note-text">{note.text}</span>
                <button
                  className="note-delete"
                  onClick={() => onDeleteNote(note.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesPanel;
