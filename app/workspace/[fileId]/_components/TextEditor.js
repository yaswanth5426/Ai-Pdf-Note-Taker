"use client"

import React from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import Highlight from "@tiptap/extension-highlight"
import TextAlign from "@tiptap/extension-text-align"
import EditorExtensions from "./EditorExtensions"
const TextEditor = () => {
  const editor = useEditor({
    immediatelyRender: false,   // ⭐ correct place

    extensions: [
     StarterKit,
    Underline,
    Highlight,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
      Placeholder.configure({
        placeholder: "Start taking your notes here...",
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-gray-400 before:absolute before:pointer-events-none",
      }),
    ],

    editorProps: {
      attributes: {
        class: "focus:outline-none h-screen p-5",
      },
    },
  })

  return (
    <div>
        <EditorExtensions editor={editor} />
      <div className="overflow-scroll h-[88vh]">
        <EditorContent editor={editor} className="prose max-w-none" />
      </div>
    </div>
  )
}

export default TextEditor