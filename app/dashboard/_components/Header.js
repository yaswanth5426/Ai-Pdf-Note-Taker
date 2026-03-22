import React from 'react'
import { UserButton } from '@clerk/nextjs'

const Header = () => {
  return (
    <div className='flex justify-between items-center p-5 shadow-md'>
      {/* Left - empty for balance */}
      <div className='w-10' />

      {/* Center - Title */}
      <h1 className='text-xl font-bold'>AI PDF Note Taker</h1>

      {/* Right - User Button */}
      <UserButton />
    </div>
  )
}

export default Header