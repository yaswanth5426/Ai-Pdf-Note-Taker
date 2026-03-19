"use client"
import React, { useState } from 'react'
import { UserButton, useUser } from "@clerk/nextjs";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { Loader2Icon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const WorkspaceHeader = ({ fileName, editor, fileId }) => {
  const { user } = useUser();
  const addNotes = useMutation(api.notes.AddNotes);
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    if (!editor || !fileId || !user) return;
    setLoading(true);
    try {
      await addNotes({
        fileId,
        notes: editor.getJSON(),
        createdBy: user.primaryEmailAddress.emailAddress,
      });
      toast.success("Notes saved!");
    } catch (e) {
      toast.error("Failed to save notes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex justify-between items-center shadow-md">
      {/* Left - Back + Logo */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <Image src={'/logo.svg'} alt='logo' width={120} height={80} />
      </div>

      {/* Center - File Name */}
      <h2 className="font-semibold text-lg">{fileName ?? 'Untitled'}</h2>

      {/* Right - Save + User */}
      <div className="flex items-center gap-3">
        <Button onClick={onSave} disabled={loading}>
          {loading ? <Loader2Icon className="animate-spin" /> : 'Save'}
        </Button>
        <UserButton />
      </div>
    </div>
  );
}

export default WorkspaceHeader;