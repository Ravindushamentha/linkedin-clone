import { BriefcaseIcon, HomeIcon, MessageSquareCodeIcon, MessageSquareIcon, MessageSquareMoreIcon, SearchIcon, UsersIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'

function Header() {
  return (
    <div className='flex items-center p-2 max-w-6xl mx-auto '>
      <Image
      className='rounded-lg'
      src='https://links.papareact.com/b3z'
      alt='Logo'
      height={40}
      width={40}
      />
     <div className='flex-1'>
        <form className='flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96'>
            <SearchIcon className='h-4 text-gray-600'/>
            <input
            className='bg-transparent flex-1 outline-none'
            type='text'
            placeholder='Search'
            />
        </form>
    </div>   

    <div className='flex space-x-7 items-center px-2 '>
       <Link href='/' className='icon'>
       <HomeIcon
       className='h-5'
       />
       <p>Home</p>
       </Link>

       <Link href='/' className='icon hidden md:flex'>
       <UsersIcon
       className='h-5'
       />
       <p>Network</p>
       </Link>

       <Link href='/' className='icon hidden md:flex'>
       <BriefcaseIcon
       className='h-5'
       />
       <p>Jobs</p>
       </Link>

       <Link href='/' className='icon'>
       <MessageSquareMoreIcon
       className='h-5'
       />
       <p>Messaging</p>
       </Link>

       {/**userbutton if signed in */}
       <SignedIn>
        <UserButton></UserButton>
       </SignedIn>

       {/**signin if not */}
       <SignedOut>
        <Button asChild variant='secondary'>
            <SignInButton/>
        </Button>
       </SignedOut>
    </div>

    </div>
  )
}

export default Header