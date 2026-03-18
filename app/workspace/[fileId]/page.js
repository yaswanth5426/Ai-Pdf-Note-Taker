"use client";
import { useParams } from "next/navigation";
import WorkspaceHeader from "./_components/WorkspaceHeader";
import PdfViewer from "./_components/PdfViewer";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import TextEditor from "./_components/TextEditor";
import Placeholder from "@tiptap/extension-placeholder";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";

export default function Workspace() {
    const { fileId } = useParams();
    const fileInfo = useQuery(api.fileStorage.getFileRecord, {
        fileId: fileId,
    });

    const editor = useEditor({
        immediatelyRender: false, // ✅ fixed position
        extensions: [
            StarterKit, // ✅ already includes Heading, BulletList, OrderedList, ListItem, Strike
            Placeholder.configure({
                placeholder: "Start taking your notes here...",
                emptyEditorClass:
                    "before:content-[attr(data-placeholder)] before:text-gray-400 before:absolute before:pointer-events-none",
            }),
            Underline,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Highlight.configure({ multicolor: true }),
        ],
        content: "",
        editorProps: {
            attributes: {
                class: "focus:outline-none h-screen p-5",
            },
        },
    });

    // ✅ fixed - single object not array
    const fileUrl = fileInfo?.signedUrl ?? null;
    const fileName = fileInfo?.fileName ?? null;

    return (
        <div>
            <WorkspaceHeader fileName={fileName} editor={editor} />
            <div className="grid grid-cols-2 gap-5"> {/* ✅ always 2 columns */}
    <div className="overflow-auto h-[92vh]">
        <TextEditor fileId={fileId} editor={editor} />
    </div>
    <div className="h-[92vh]">
        <PdfViewer fileUrl={fileUrl} />
    </div>
</div>
        </div>
    );
}