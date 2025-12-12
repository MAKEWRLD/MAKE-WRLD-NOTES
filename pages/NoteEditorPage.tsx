import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Printer, Cloud, Check, Loader2, Save } from 'lucide-react';
import { NoteContext } from '../App';
import { Button } from '../components/Button';

type SaveStatus = 'saved' | 'saving' | 'unsaved';

export const NoteEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { notes, addNote, updateNote, deleteNote } = useContext(NoteContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [lastSavedData, setLastSavedData] = useState({ title: '', content: '' });
  
  // Track if we have initialized data to prevent overwriting user input with stale context data
  const isInitialized = useRef(false);

  // Load existing note data
  useEffect(() => {
    if (id && !isInitialized.current) {
      const existingNote = notes.find(n => n.id === id);
      if (existingNote) {
        setTitle(existingNote.title);
        setContent(existingNote.content);
        setLastSavedData({ title: existingNote.title, content: existingNote.content });
        isInitialized.current = true;
      } else {
        // ID invalid, go back
        navigate('/');
      }
    } else if (!id) {
      // New note
      isInitialized.current = true;
    }
  }, [id, notes, navigate]);

  // Handle actual save logic
  const performSave = useCallback(() => {
    if (!title.trim() && !content.trim()) return;
    
    // Prevent saving if nothing changed from last save (avoids loop)
    if (title === lastSavedData.title && content === lastSavedData.content) {
      setSaveStatus('saved');
      return;
    }

    setSaveStatus('saving');

    // Simulate network/storage delay slightly for UX feel
    setTimeout(() => {
      if (id) {
        updateNote(id, title, content);
        setLastSavedData({ title, content });
        setSaveStatus('saved');
      } else {
        // Creating a new note
        const newId = addNote(title, content);
        setLastSavedData({ title, content });
        setSaveStatus('saved');
        // Update URL to edit mode without reloading component state
        navigate(`/edit/${newId}`, { replace: true });
        // Update ref so we don't re-initialize
        isInitialized.current = true;
      }
    }, 400);
  }, [id, title, content, lastSavedData, updateNote, addNote, navigate]);

  // Auto-save debounce effect
  useEffect(() => {
    // If not initialized yet, don't auto-save empty state over existing note
    if (!isInitialized.current) return;

    // Check if dirty
    if (title !== lastSavedData.title || content !== lastSavedData.content) {
      setSaveStatus('unsaved');
      
      const timeoutId = setTimeout(() => {
        performSave();
      }, 1500); // Auto-save after 1.5s of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [title, content, lastSavedData, performSave]);

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja apagar esta nota?')) {
      if (id) deleteNote(id);
      navigate('/');
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  // Render the status icon/text
  const renderStatus = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-sm animate-pulse">
            <Loader2 size={14} className="animate-spin" />
            <span className="hidden sm:inline">Salvando...</span>
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-sm">
            <Cloud size={16} />
            <span className="hidden sm:inline">Salvo</span>
          </div>
        );
      case 'unsaved':
        return (
          <div className="flex items-center gap-1.5 text-amber-500/80 text-sm">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="hidden sm:inline">Não salvo</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      {/* Navbar */}
      <div className="no-print sticky top-0 z-10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <button 
          onClick={() => navigate('/')}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="flex items-center gap-3">
          <div className="mr-2">
            {renderStatus()}
          </div>

          <button 
            onClick={handleExportPDF}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors hidden sm:block"
            title="Exportar PDF / Imprimir"
          >
            <Printer size={20} />
          </button>

          {id && (
            <button 
                onClick={handleDelete}
                className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                title="Apagar nota"
            >
                <Trash2 size={20} />
            </button>
          )}

          {/* Manual Save Button (Optional now, but good for forcing save) */}
          <Button onClick={performSave} disabled={saveStatus === 'saved' || (!title && !content)}>
            <Save size={18} />
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-6 sm:p-10">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-300 dark:placeholder:text-slate-700 border-none focus:ring-0 px-0 mb-4"
        />
        
        <textarea
          placeholder="Comece a digitar..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-[calc(100vh-250px)] resize-none bg-transparent text-lg text-slate-700 dark:text-slate-300 placeholder:text-slate-300 dark:placeholder:text-slate-700 border-none focus:ring-0 px-0 leading-relaxed"
        />
      </div>
      
      {/* Print-only footer */}
      <div className="hidden print-only fixed bottom-0 left-0 w-full text-center text-xs text-slate-400 p-4 border-t">
        Gerado via MAKE WRLD NOTES
      </div>
    </div>
  );
};