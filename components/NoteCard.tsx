import React from 'react';
import { Note } from '../types';
import { Pin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NoteCardProps {
  note: Note;
  togglePin: (e: React.MouseEvent, id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, togglePin }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/edit/${note.id}`);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer flex flex-col h-48 overflow-hidden"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 line-clamp-1 pr-8">
          {note.title || "Sem título"}
        </h3>
        <button
          onClick={(e) => togglePin(e, note.id)}
          className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${
            note.isPinned 
              ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500' 
              : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100'
          }`}
          title={note.isPinned ? "Desafixar" : "Fixar"}
        >
          <Pin size={18} className={note.isPinned ? "fill-current" : ""} />
        </button>
      </div>
      
      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-4 flex-grow whitespace-pre-wrap">
        {note.content || "Sem conteúdo adicional..."}
      </p>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <Calendar size={12} />
        <span>{formatDate(note.updatedAt)}</span>
      </div>
    </div>
  );
};