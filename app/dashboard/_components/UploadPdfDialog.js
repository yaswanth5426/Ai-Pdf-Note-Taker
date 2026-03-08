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



const UploadPdfDialog = ({ children }) => {
  return (
   <Dialog>
  <DialogTrigger asChild>{children}</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle> Upload Pdf File </DialogTitle>
       <DialogDescription asChild>
        <div className=''>
           <h2 className='mt-5'>Select a file to upload</h2>  
            <div className=' gap-2 p-3 '>
         
               <input type='file' accept = 'application/pdf'/>
            </div>

            <div>
              <label> File Name *</label>
              <Input placeholder=' File Name' />  
            </div>

           
        </div>
            </DialogDescription>
    </DialogHeader>
     <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
          <Button type="submit">Upload</Button>
        </DialogFooter>
  </DialogContent>
</Dialog>
  )
}

export default UploadPdfDialog
