"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createNote } from '@/lib/db';
import Editor from '@/components/editor/advance-editor';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { JSONContent } from "novel";

export default function NewNote() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [value, setValue] = useState<JSONContent>();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setSaving(true);
    try {
      await createNote(title, value as JSONContent);
      toast.success('Note created successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to create note');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold">New Note</h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Note'}
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
        <Editor onChange={setValue} />
      </div>
    </div>
  );
}