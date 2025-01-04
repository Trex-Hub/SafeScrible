"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getNotes, deleteNote, type Note } from '@/lib/db';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const fetchedNotes = await getNotes();
        setNotes(fetchedNotes);
      } catch (error) {
        toast.error('Failed to load notes');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    loadNotes();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteNote(id);
      const updatedNotes = await getNotes();
      setNotes(updatedNotes);
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error('Failed to delete note');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Notes</h1>
        <Link href="/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <Card key={note.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Link href={`/note/${note.id}`} className="flex-1">
                  <CardTitle className="text-xl mb-2 hover:text-primary">
                    {note.title}
                  </CardTitle>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => note.id && handleDelete(note.id)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Last updated: {format(new Date(note.updated_at), 'PPp')}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No notes yet. Create your first note!</p>
        </div>
      )}
    </div>
  );
}