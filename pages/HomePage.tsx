import React, { useState, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Settings, X, StickyNote } from 'lucide-react';
import { NoteContext } from '../App';
import { NoteCard } from '../components/NoteCard';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { notes, togglePin } = useContext(NoteContext);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    
    const result = notes.filter(note => 
      note.title.toLowerCase().includes(lowerQuery) || 
      note.content.toLowerCase().includes(lowerQuery)
    );

    // Sort: Pinned first, then by updatedAt descending
    return result.sort((a, b) => {
      if (a.isPinned === b.isPinned) {
        return b.updatedAt - a.updatedAt;
      }
      return a.isPinned ? -1 : 1;
    });
  }, [notes, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
                <StickyNote className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">MAKE WRLD NOTES</h1>
        </div>
        <button 
          onClick={() => navigate('/settings')}
          className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          aria-label="Configurações"
        >
          <Settings size={24} />
        </button>
      </header>

      {/* Search Bar */}
      <div className="relative mb-8 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-3.5 border-none rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow text-base placeholder:text-slate-400"
          placeholder="Pesquisar notas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 opacity-60">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Search className="h-10 w-10 text-slate-400" />
          </div>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
            {searchQuery ? "Nenhuma nota encontrada" : "Crie sua primeira nota!"}
          </p>
        </div>
      )}

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
        {filteredNotes.map(note => (
          <NoteCard 
            key={note.id} 
            note={note} 
            togglePin={(e, id) => {
              e.stopPropagation();
              togglePin(id);
            }} 
          />
        ))}
      </div>

      {/* FAB (Floating Action Button) */}
      <button
        onClick={() => navigate('/create')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
        aria-label="Criar nova nota"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};