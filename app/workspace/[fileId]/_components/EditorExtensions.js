"use client"

import { useParams } from "next/navigation"
import { useAction } from "convex/react"
import { api } from "@/convex/_generated/api"
import { chatSession } from "../../../../configs/AIModel";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles
} from "lucide-react"

export default function EditorExtensions({ editor }) {

  const { fileId } = useParams()
  const searchAI = useAction(api.myAction.search)

  const onAiClick = async () => {
  if (!editor) return

  const selectedText = editor.state.doc.textBetween(
    editor.state.selection.from,
    editor.state.selection.to,
    " "
  )

  if (!selectedText) {
    alert("Select text first")
    return
  }

  console.log("Selected:", selectedText)

  const result = await searchAI({
    query: selectedText,
    fileId
  })

  // ⭐ safety
  if (!Array.isArray(result)) {
    alert("AI search failed")
    return
  }

  // ⭐ build context from vector chunks
  const context = result
    .map(r => r.pageContent)
    .join("\n")

  const PROMPT = `
You are an AI assistant.

Answer the question using ONLY the provided resume content.

Question:
${selectedText}

Resume Content:
${context}

Give a clear structured answer in HTML.
`

  const aiRes = await chatSession.sendMessage(PROMPT)

  const finalAnswer = await aiRes.response.text()

  // ⭐ insert AI answer

  const finalAns = aiRes.response
            .text()
            .replaceAll("```", "")
            .replace("html", "");

        const allText = editor.getHTML();
        editor.commands.setContent(
            `${allText}<p><strong>Answer: </strong>${finalAns}</p>`
        );
}

  if (!editor) return null

  const btn = "p-2 rounded hover:bg-gray-200 transition"

  return (
    <div className="p-3 border-b flex gap-2 flex-wrap">

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level:1 }).run()}
        className={`${btn} ${editor.isActive("heading",{level:1}) ? "text-blue-500 bg-blue-50" : ""}`}
      >
        <Heading1 className="w-5 h-5"/>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level:2 }).run()}
        className={`${btn} ${editor.isActive("heading",{level:2}) ? "text-blue-500 bg-blue-50" : ""}`}
      >
        <Heading2 className="w-5 h-5"/>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level:3 }).run()}
        className={`${btn} ${editor.isActive("heading",{level:3}) ? "text-blue-500 bg-blue-50" : ""}`}
      >
        <Heading3 className="w-5 h-5"/>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${btn} ${editor.isActive("bold") ? "text-blue-500 bg-blue-50" : ""}`}
      >
        <Bold className="w-5 h-5"/>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${btn} ${editor.isActive("italic") ? "text-blue-500 bg-blue-50" : ""}`}
      >
        <Italic className="w-5 h-5"/>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`${btn} ${editor.isActive("underline") ? "text-blue-500 bg-blue-50" : ""}`}
      >
        <UnderlineIcon className="w-5 h-5"/>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`${btn} ${editor.isActive("strike") ? "text-blue-500 bg-blue-50" : ""}`}
      >
        <Strikethrough className="w-5 h-5"/>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`${btn} ${editor.isActive("highlight") ? "text-blue-500 bg-blue-50" : ""}`}
      >
        <Highlighter className="w-5 h-5"/>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`${btn} ${editor.isActive("codeBlock") ? "text-blue-500 bg-blue-50" : ""}`}
      >
        <Code className="w-5 h-5"/>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${btn} ${editor.isActive("bulletList") ? "text-blue-500 bg-blue-50" : ""}`}
      >
        <List className="w-5 h-5"/>
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${btn} ${editor.isActive("orderedList") ? "text-blue-500 bg-blue-50" : ""}`}
      >
        <ListOrdered className="w-5 h-5"/>
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`${btn} ${editor.isActive({textAlign:"left"}) ? "text-blue-500 bg-blue-50" : ""}`}
      >
        <AlignLeft className="w-5 h-5"/>
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`${btn} ${editor.isActive({textAlign:"center"}) ? "text-blue-500 bg-blue-50" : ""}`}
      >
        <AlignCenter className="w-5 h-5"/>
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`${btn} ${editor.isActive({textAlign:"right"}) ? "text-blue-500 bg-blue-50" : ""}`}
      >
        <AlignRight className="w-5 h-5"/>
      </button>
      
      <button
        onClick={() => onAiClick()}
        className={'hover:text-blue-500'}
      >
        <Sparkles/>
      </button>
    </div>
  )
}
