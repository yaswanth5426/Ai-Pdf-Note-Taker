"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2Icon } from 'lucide-react'
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from '@clerk/nextjs'
import { v4 as uuidv4 } from "uuid";
import axios from 'axios';
import { toast } from 'sonner';

const UploadPdfDialog = ({ children, isMaxFile }) => {
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const addFileentry = useMutation(api.fileStorage.AddFileEntryToDb);
  const { user } = useUser();
  const getFileUrl = useMutation(api.fileStorage.getFileUrl);
  const embeddedDocument = useAction(api.myAction.ingest);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [open, setOpen] = useState(false);

  const OnFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setFileName(nameWithoutExt);
    }
  }

  const onClose = () => {
    if (loading) return;
    setOpen(false);
    setFile(null);
    setFileName('');
  }

  const OnUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    setLoading(true);
    toast.loading("Uploading PDF...", { id: "upload" });

    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type },
        body: file,
      });
      const { storageId } = await result.json();
      const fileId = uuidv4();
      const fileUrl = await getFileUrl({ storageId });

      await addFileentry({
        fileId,
        storageId,
        fileUrl,
        fileName: fileName || 'Unnamed File',
        createdBy: user?.primaryEmailAddress?.emailAddress
      });

      toast.loading("Processing PDF...", { id: "upload" });
      const ApiResponse = await axios.get('/api/pdf-loader?pdfUrl=' + fileUrl);
      
      toast.loading("Generating embeddings...", { id: "upload" });
      await embeddedDocument({
        splitText: ApiResponse.data.result,
        fileId,
      });

      toast.success("PDF uploaded successfully! 🎉", { id: "upload" });
      setOpen(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed: " + error.message, { id: "upload" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          disabled={isMaxFile}
          className="w-full"
        >
          + Upload PDF File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Pdf File</DialogTitle>
          <DialogDescription asChild>
            <div>
              <h2 className='mt-5'>Select a file to upload</h2>
              
              {/* ✅ Styled file picker */}
              <div className='flex items-center gap-3 mt-3 mb-4'>
                <label className="cursor-pointer">
                  <div className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition">
                    Choose file
                  </div>
                  <input
                    type='file'
                    accept='application/pdf'
                    onChange={OnFileSelect}
                    className="hidden"
                  />
                </label>
                <span className="text-sm text-gray-500 truncate max-w-[200px]">
                  {file ? file.name : "No file chosen"}
                </span>
              </div>

              <div>
                <label className="text-sm font-medium">File Name *</label>
                <Input
                  placeholder='File Name'
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Close
          </Button>
          <Button onClick={OnUpload} disabled={loading || !file}>
            {loading ? <Loader2Icon className='animate-spin' /> : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UploadPdfDialog