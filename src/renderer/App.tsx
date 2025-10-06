import React, { useState, useEffect } from 'react';
import NotesPanel from './components/NotesPanel';
import VisualizationPanel from './components/VisualizationPanel';

interface Note {
  id: string;
  text: string;
  timestamp: number;
}

interface Activity {
  id: string;
  type: 'win' | 'loss';
  amount: number;
  description: string;
  timestamp: number;
}

interface LogData {
  name: string;
  notes: Note[];
  activities: Activity[];
}

declare global {
  interface Window {
    electronAPI: {
      saveLog: (name: string, data: LogData) => Promise<any>;
      loadLog: () => Promise<any>;
    };
  }
}

const App: React.FC = () => {
  const [logName, setLogName] = useState<string>('');
  const [showNameModal, setShowNameModal] = useState<boolean>(false);
  const [tempLogName, setTempLogName] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentFilePath, setCurrentFilePath] = useState<string>('');

  const handleCreateNew = () => {
    setShowNameModal(true);
    setTempLogName('');
  };

  const handleConfirmName = () => {
    if (tempLogName.trim()) {
      setLogName(tempLogName.trim());
      setNotes([]);
      setActivities([]);
      setCurrentFilePath('');
      setShowNameModal(false);
    }
  };

  const handleAddNote = (text: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      text,
      timestamp: Date.now()
    };
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleAddActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    setActivities([...activities, newActivity]);
  };

  const handleSave = async () => {
    if (!logName) {
      alert('Please create a new log first');
      return;
    }

    const logData: LogData = {
      name: logName,
      notes,
      activities
    };

    const result = await window.electronAPI.saveLog(logName, logData);
    if (result.success) {
      setCurrentFilePath(result.filePath);
      alert('Log saved successfully!');
    } else if (!result.canceled) {
      alert('Failed to save log: ' + (result.error || 'Unknown error'));
    }
  };

  const handleLoad = async () => {
    const result = await window.electronAPI.loadLog();
    if (result.success) {
      const data: LogData = result.data;
      setLogName(data.name);
      setNotes(data.notes || []);
      setActivities(data.activities || []);
      setCurrentFilePath(result.filePath);
    } else if (!result.canceled) {
      alert('Failed to load log: ' + (result.error || 'Unknown error'));
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Loggo {logName && `- ${logName}`}</h1>
        <div className="header-actions">
          <button className="btn" onClick={handleCreateNew}>New Log</button>
          <button className="btn btn-secondary" onClick={handleLoad}>Load Log</button>
          <button className="btn btn-success" onClick={handleSave} disabled={!logName}>
            Save Log
          </button>
        </div>
      </header>

      <div className="main-content">
        {logName ? (
          <>
            <NotesPanel
              notes={notes}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
            />
            <VisualizationPanel
              activities={activities}
              onAddActivity={handleAddActivity}
            />
          </>
        ) : (
          <div className="empty-state" style={{ flex: 1 }}>
            <h3>Welcome to Loggo</h3>
            <p>Create a new log or load an existing one to get started</p>
          </div>
        )}
      </div>

      {showNameModal && (
        <div className="log-name-modal">
          <div className="modal-content">
            <h2>Create New Log</h2>
            <div className="form-group">
              <label className="form-label">Log Name:</label>
              <input
                type="text"
                className="form-input"
                value={tempLogName}
                onChange={(e) => setTempLogName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleConfirmName()}
                autoFocus
              />
            </div>
            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={() => setShowNameModal(false)}>
                Cancel
              </button>
              <button className="btn" onClick={handleConfirmName} disabled={!tempLogName.trim()}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
