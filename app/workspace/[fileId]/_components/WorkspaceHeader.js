import React from 'react'
import { UserButton, useUser } from "@clerk/nextjs";
import Image from 'next/image';

const WorkspaceHeader = () => {
  return (
    <div className = 'p-4 flex justify-between'>

      <Image src={'/logo.svg'} alt= 'logo' width={140} height = {100}/>
       <UserButton/>
    </div>
  )
}

export default WorkspaceHeader
