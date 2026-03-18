"use client"
import React from 'react'
import { UserButton } from "@clerk/nextjs";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

const WorkspaceHeader = ({ fileName, editor, fileId }) => {
  const { user } = useUser();
  const addNotes = useMutation(api.notes.AddNotes);

  const onSave = async () => {
    if (!editor || !fileId || !user) return;
    await addNotes({
      fileId,
      notes: editor.getJSON(),
      createdBy: user.primaryEmailAddress.emailAddress,
    });
    toast.success("Notes saved!");
  };

  return (
    <div className="p-4 flex justify-between items-center shadow-md">
      {/* Left - Logo */}
      <Image src={'/logo.svg'} alt='logo' width={140} height={100} />

      {/* Center - File Name */}
      <h2 className="font-semibold text-lg">{fileName ?? 'Untitled'}</h2>

      {/* Right - Save + User */}
      <div className="flex items-center gap-3">
        <Button onClick={onSave}>Save</Button>
        <UserButton />
      </div>
    </div>
  );
}

export default WorkspaceHeader;