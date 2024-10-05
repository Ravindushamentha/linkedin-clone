import { currentUser,  } from '@clerk/nextjs/server'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { SignedIn, SignedOut, SignIn, SignInButton } from '@clerk/nextjs';
import { Button } from './ui/button';
import { IPostDocument } from '@/Mongodb/models/Post';

 async function UserInformation( {posts}: {posts: IPostDocument[] })   {

    const user= await currentUser();

    const userPosts = posts?.filter((post) => post.user.userId == user?.id) || [] ;

     const userComments = posts.flatMap(
        (post) => 
            post?.comments?.filter((comment) => comment.user.userId === user?.id) || []
    );
    
  return (
    <div className='items-center justify-center flex flex-col bg-white mr-6 rounded-lg border py-4 '>
        

        <SignedIn>
                <Avatar>
                    <AvatarImage src={user?.imageUrl }  />
                    <AvatarFallback>{user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}</AvatarFallback>
                </Avatar>

             <div className='text-center'>
                <p className='font-semibold'>
                    {user?.firstName}{user?.lastName}
                </p>

                <p className='text-xs'>
                    @{user?.firstName}_
                    {user?.lastName?.slice(-4)}
                </p>
            </div>
        </SignedIn>

        <SignedOut>
            <div className='text-center space-y-2'>
                <p className='font-semibold'>Please sign in</p>

                <Button asChild>
                <SignInButton>Sign In</SignInButton>

            </Button>
            </div> 
        </SignedOut>
        

        <SignedIn>
                <hr className='w-full border-gray-200 my-5'/>

            <div className='flex justify-between w-full px-4 text-sm'>
            <p className='font-semibold text-gray-400'>Posts</p>
            <p className='text-blue-400'>{userPosts.length}</p>
        </div>

        <div className='flex justify-between w-full px-4 text-sm'>
            <p className='font-semibold text-gray-400'>Comments</p>
            <p className='text-blue-400'>{userComments.length}</p>
        </div>
        </SignedIn>
        
    </div>
  )
}

export default UserInformation