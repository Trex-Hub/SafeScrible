import { openDB } from 'idb';
import type { JSONContent } from 'novel';

export interface Note {
  id?: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const dbName = 'notesDB';
const storeName = 'notes';

const initDB = async () => {
  return openDB(dbName, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        store.createIndex('updated_at', 'updated_at');
      }
    },
  });
};

export const getNotes = async (): Promise<Note[]> => {
  const db = await initDB();
  return db.getAllFromIndex(storeName, 'updated_at');
};

export const getNote = async (id: number): Promise<Note | undefined> => {
  const db = await initDB();
  return db.get(storeName, id);
};

export const createNote = async (title: string, content: JSONContent): Promise<Note> => {
  const db = await initDB();
  const now = new Date().toISOString();
  const note: Note = {
    title,
    content: JSON.stringify(content),
    created_at: now,
    updated_at: now,
  };
  
  const id = await db.add(storeName, note);
  return { ...note, id };
};

export const updateNote = async (id: number, title: string, content: JSONContent): Promise<Note> => {
  const db = await initDB();
  const note = await getNote(id);
  
  if (!note) {
    throw new Error('Note not found');
  }
  
  const updatedNote: Note = {
    ...note,
    title,
    content: JSON.stringify(content),
    updated_at: new Date().toISOString(),
  };
  
  await db.put(storeName, updatedNote);
  return updatedNote;
};

export const deleteNote = async (id: number): Promise<void> => {
  const db = await initDB();
  await db.delete(storeName, id);
};