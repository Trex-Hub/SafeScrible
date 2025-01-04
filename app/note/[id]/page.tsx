"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Editor from '@/components/editor/advance-editor';
import { getNote, updateNote, getNotes } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import type { JSONContent } from 'novel';

export default function EditNote({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<JSONContent>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const note = await getNote(parseInt(params.id));
        if (note) {
          setTitle(note.title);
          setContent(JSON.parse(note.content));
        }
      } catch (error) {
        toast.error('Failed to load note');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [params.id]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setSaving(true);
    try {
      await updateNote(parseInt(params.id), title, content);
      toast.success('Note updated successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to update note');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Loading note...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold">Edit Note</h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="space-y-6">
        <Input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-semibold"
        />
        <Editor initialValue={content} onChange={setContent} />
      </div>
    </div>
  );
}