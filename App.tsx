import React, { useState, useEffect, createContext } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Note, NoteContextType, Theme, ThemeContextType } from './types';
import { getStoredNotes, saveStoredNotes, getStoredTheme, saveStoredTheme } from './services/storageService';
import { HomePage } from './pages/HomePage';
import { NoteEditorPage } from './pages/NoteEditorPage';
import { SettingsPage } from './pages/SettingsPage';

// Simple UUID generator fallback
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const NoteContext = createContext<NoteContextType>({} as NoteContextType);
export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

const App: React.FC = () => {
  // --- State ---
  const [notes, setNotes] = useState<Note[]>([]);
  const [theme, setTheme] = useState<Theme>('light');

  // --- Initialization ---
  useEffect(() => {
    const loadedNotes = getStoredNotes();
    setNotes(loadedNotes);

    const loadedTheme = getStoredTheme();
    setTheme(loadedTheme);
  }, []);

  // --- Effects ---
  useEffect(() => {
    saveStoredNotes(notes);
  }, [notes]);

  useEffect(() => {
    saveStoredTheme(theme);
    // Apply theme to HTML element for Tailwind
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // --- Actions ---
  const addNote = (title: string, content: string) => {
    const id = generateId();
    const newNote: Note = {
      id,
      title,
      content,
      isPinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
    return id;
  };

  const updateNote = (id: string, title: string, content: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, title, content, updatedAt: Date.now() } 
        : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const togglePin = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, isPinned: !note.isPinned } 
        : note
    ));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <NoteContext.Provider value={{ notes, addNote, updateNote, deleteNote, togglePin }}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<NoteEditorPage />} />
            <Route path="/edit/:id" element={<NoteEditorPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Router>
      </NoteContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;