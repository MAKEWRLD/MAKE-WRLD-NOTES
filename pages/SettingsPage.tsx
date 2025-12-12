import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Trash2, Github, Info } from 'lucide-react';
import { ThemeContext, NoteContext } from '../App';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { notes } = useContext(NoteContext);

  const handleClearData = () => {
    if (window.confirm('CUIDADO: Isso apagará TODAS as suas notas. Esta ação não pode ser desfeita. Continuar?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Configurações</h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        
        {/* Appearance Section */}
        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Aparência</h2>
          </div>
          <div className="p-2">
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-orange-100 text-orange-500'}`}>
                  {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-900 dark:text-slate-100">Tema</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {theme === 'dark' ? 'Modo Escuro Ativo' : 'Modo Claro Ativo'}
                  </p>
                </div>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-300'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>
        </section>

        {/* Data Section */}
        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Dados</h2>
          </div>
          <div className="p-2">
             <div className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-700/50">
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500">
                        <Info size={20} />
                    </div>
                    <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">Estatísticas</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {notes.length} nota{notes.length !== 1 && 's'} armazenada{notes.length !== 1 && 's'}
                        </p>
                    </div>
                </div>
             </div>

            <button 
              onClick={handleClearData}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 group transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 group-hover:text-red-600">
                  <Trash2 size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-red-600 dark:text-red-400">Apagar tudo</p>
                  <p className="text-sm text-red-400 dark:text-red-500/70">
                    Remove todas as notas localmente
                  </p>
                </div>
              </div>
            </button>
          </div>
        </section>

        <div className="text-center pt-8 text-slate-400 dark:text-slate-600">
            <p className="text-xs">Versão 1.0.0 • MAKE WRLD NOTES</p>
        </div>
      </div>
    </div>
  );
};