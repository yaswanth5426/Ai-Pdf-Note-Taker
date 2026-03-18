"use client";
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, ShieldCheck } from 'lucide-react' // ✅ correct icons
import { Progress } from "@/components/ui/progress"
import UploadPdfDialog from './UploadPdfDialog'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { usePathname } from 'next/navigation'
import Link from 'next/link' // ✅ Link from next/link not lucide
import { useMutation } from 'convex/react'

const SideBar = () => {
  const { user, isLoaded } = useUser();
  const path = usePathname();
const getUserInfo = useQuery(api.user.getUserInfo, {
        userEmail: user?.primaryEmailAddress?.emailAddress,
    });
  const fileList = useQuery(api.fileStorage.getUserFiles, {
    userEmail: user?.primaryEmailAddress?.emailAddress,
  });

  if (!isLoaded) return null;

  return (
    <div className='shadow-md h-screen p-7'>
      <Image src="/logo.svg" alt="logo" width={170} height={120} />
      <div className='mt-10'>
        <UploadPdfDialog isMaxFile={fileList?.length >= 5 && !getUserInfo.upgrade
                            ? true
                            : false}>
          <Button className="w-full hover:rounded-lg cursor-pointer">+ Upload PDF</Button>
        </UploadPdfDialog>

        <Link href="/dashboard">
          <div className={`flex gap-2 items-center p-3 mt-5 hover:bg-slate-100 rounded-lg cursor-pointer ${path === '/dashboard' && 'bg-slate-200'}`}>
            <LayoutDashboard />
            <h2>Workspace</h2>
          </div>
        </Link>

        <Link href="/dashboard/upgrade">
          <div className={`flex gap-2 items-center p-3 mt-1 hover:bg-slate-100 rounded-lg cursor-pointer ${path === '/dashboard/upgrade' && 'bg-slate-200'}`}>
            <ShieldCheck />
            <h2>Upgrade</h2>
          </div>
        </Link>
      </div>

       {!getUserInfo?.upgrade && (
                <div className="absolute bottom-24 w-[80%]">
                    <Progress value={(fileList?.length / 5) * 100} />
                    <p className="text-sm mt-1">
                        {fileList?.length} out of 5 Pdf Uploaded
                    </p>
                    <p className="text-sm mt-2 text-gray-400">
                        Upgrade to Upload more PDF
                    </p>
                </div>
            )}
    </div>
  )
}

export default SideBar