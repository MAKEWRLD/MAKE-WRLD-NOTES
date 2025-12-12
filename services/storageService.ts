import { Note, Theme } from '../types';
import { STORAGE_KEY_NOTES, STORAGE_KEY_THEME } from '../constants';

export const getStoredNotes = (): Note[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_NOTES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading notes:', error);
    return [];
  }
};

export const saveStoredNotes = (notes: Note[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes:', error);
  }
};

export const getStoredTheme = (): Theme => {
  try {
    const theme = localStorage.getItem(STORAGE_KEY_THEME);
    return (theme === 'dark' || theme === 'light') ? theme : 'light';
  } catch {
    return 'light';
  }
};

export const saveStoredTheme = (theme: Theme): void => {
  localStorage.setItem(STORAGE_KEY_THEME, theme);
};