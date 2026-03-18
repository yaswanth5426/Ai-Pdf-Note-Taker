"use client";

import { useEffect } from "react";
import { EditorContent } from "@tiptap/react";
import EditorExtenstion from "./EditorExtensions";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export default function TextEditor({ fileId, editor }) {
  const { user } = useUser();
  const notes = useQuery(api.notes.GetNotes, 
    fileId ? { fileId } : "skip"  // ✅ skip if fileId not ready
  );
  const addNotes = useMutation(api.notes.AddNotes);

  // ✅ Load saved notes into editor
  useEffect(() => {
    if (editor && notes) {
      editor.commands.setContent(notes);
    }
  }, [notes, editor]); // ✅ fixed dependency array

  // ✅ Auto-save on every change
  useEffect(() => {
    if (!editor || !fileId || !user) return;

    const handleUpdate = () => {
      clearTimeout(window._notesSaveTimer);
      window._notesSaveTimer = setTimeout(() => {
        addNotes({
          fileId,
          notes: editor.getJSON(),
          createdBy: user.primaryEmailAddress.emailAddress,
        });
      }, 1000);
    };

    editor.on("update", handleUpdate);
    return () => editor.off("update", handleUpdate); // ✅ cleanup
  }, [editor, fileId, user]);

  // ✅ Always render — never return null
  if (!editor) return <div>Loading editor...</div>;

  return (
    <div>
      <EditorExtenstion editor={editor} />
      <div className="overflow-scroll h-[88vh]">
        <EditorContent editor={editor} className="prose max-w-none" />
      </div>
    </div>
  );
}