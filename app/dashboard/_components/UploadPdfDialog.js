"use client"
import React from 'react'
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
import { Loader2Icon, SplitSquareVertical } from 'lucide-react'
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from '@clerk/nextjs'
import { v4 as uuidv4 } from "uuid";
import { useState } from 'react';
import axios from 'axios';
import { useAction } from "convex/react";





const UploadPdfDialog = ({ children,isMaxFile }) => {
const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl );
const addFileentry = useMutation(api.fileStorage.AddFileEntryToDb);
const {user} = useUser();
const getFileUrl = useMutation(api.fileStorage.getFileUrl);
const embeddedDocument = useAction(api.myAction.ingest);
const [file,setFile] = React.useState();
const [loading,setLoading] = React.useState(false);
const [fileName, setFileName] = useState(null);
const [open, setOpen] = React.useState(false);
const OnFileSelect = (event) => {
  
      setFile(event.target.files[0]);
}

const OnUpload = async () => {
  setLoading(true);

   const postUrl = await generateUploadUrl();

   const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file?.type },
      body: file,
    });
    const { storageId } = await result.json();
    const fileId= uuidv4();
    const fileUrl = await getFileUrl({storageId:storageId});
    const resp = await addFileentry({
      fileId:fileId,
      storageId:storageId,
      fileUrl:fileUrl,
      fileName:fileName??'Unnamed File',
      createdBy:user?.primaryEmailAddress?.emailAddress 
    })
    
    console.log(resp);

     const ApiResponse = await axios.get('/api/pdf-loader?pdfUrl='+fileUrl);
      console.log(ApiResponse.data.result);
    await embeddedDocument({
        splitText:ApiResponse.data.result,
        fileId:fileId
      });
    //   console.log(embeddedResult);
    setLoading(false);
    setOpen(false);
}

  return (
   <Dialog open={open}>
  <DialogTrigger asChild>
    <Button onClick={()=>setOpen(true)} disabled = {isMaxFile} className = "w-full">+ Upload PDF File</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle> Upload Pdf File </DialogTitle>
       <DialogDescription asChild>
        <div className=''>
           <h2 className='mt-5'>Select a file to upload</h2>  
            <div className=' gap-2 p-3 '>
         
               <input type='file' accept = 'application/pdf'
                 onChange= {(event) => OnFileSelect(event)}
               />
            </div>

            <div>
              <label> File Name *</label>
              <Input placeholder=' File Name' onChange= {(e) => setFileName(e.target.value)} />  
            </div>

           
        </div>
            </DialogDescription>
    </DialogHeader>
     <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
          <Button onClick={OnUpload} disabled = {loading}>
            {
              loading?<Loader2Icon className='animate-spin'/>:'Upload'
            }

          </Button>
        </DialogFooter>
  </DialogContent>
</Dialog>
  )
}

export default UploadPdfDialog
