"use client"
import React from 'react'
import { useParams } from 'next/navigation'
import WorkspaceHeader from './_components/WorkspaceHeader'
import PdfViewer from "./_components/PdfViewer"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import TextEditor from './_components/TextEditor'

const Workspace = () => {

  const { fileId } = useParams()

  const fileInfo = useQuery(
    api.fileStorage.getFileRecord,
    fileId ? { fileId } : "skip"
  )

  // ⭐ loading state
  if (fileInfo === undefined) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading workspace...
      </div>
    )
  }

  // ⭐ safety if record not found
  if (!fileInfo) {
    return <div>File not found</div>
  }

  return (
    <div>
      <WorkspaceHeader />
      <div className='grid grid-cols-2 gap-5'>
        <div>
          <TextEditor />
        </div>

        <div>
          <PdfViewer fileUrl={fileInfo.fileUrl} />
        </div>
      </div>
    </div>
  )
}

export default Workspace