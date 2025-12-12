export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
}

export type Theme = 'light' | 'dark';

export interface NoteContextType {
  notes: Note[];
  addNote: (title: string, content: string) => string;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
}

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}