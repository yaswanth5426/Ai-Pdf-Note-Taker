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
  DialogClose
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
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [open, setOpen] = useState(false);

  const OnFileSelect = (event) => {
    setFile(event.target.files[0]);
  }

  const onClose = () => {
    if (loading) return; // ✅ don't close while uploading
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

      const ApiResponse = await axios.get('/api/pdf-loader?pdfUrl=' + fileUrl);
      await embeddedDocument({
        splitText: ApiResponse.data.result,
        fileId,
      });

      toast.success("PDF uploaded successfully!");
      setOpen(false); // ✅ close on success
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed: " + error.message);
    } finally {
      setLoading(false); // ✅ always reset loading
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
              <div className='gap-2 p-3'>
                <input
                  type='file'
                  accept='application/pdf'
                  onChange={OnFileSelect}
                />
              </div>
              <div>
                <label>File Name *</label>
                <Input
                  placeholder='File Name'
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
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