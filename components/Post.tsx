'use client';

import { IPostDocument } from '@/Mongodb/models/Post'
import { useUser } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import ReactTimeago from "react-timeago" ; 
import { Button } from './ui/button';
import { Trash2 } from 'lucide-react';
import deletePostAction from '@/actions/deletePostAction';
import Image from 'next/image';
import { revalidatePath } from 'next/cache';
import PostOptions from './PostOptions';
import { toast } from 'sonner';




function Post({post}: {post: IPostDocument}) {

    const{ user} = useUser();
     
    const isAuthor = user?.id === post.user.userId;

 
  return (
    <div className='bg-white rounded-md border '>
        <div className='p-4 flex space-x-2 '> 
          <div >
              <Avatar>
                <AvatarImage src={post.user.userImage}/>
                <AvatarFallback>
                  {post.user.firstName?.charAt(0)}
                  {post.user.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
          </div>
           <div className='flex justify-between flex-1'>
            <div>
              <p className='font-semibold text-sm'>
                {post.user.firstName} {post.user.lastName} {""}
                {isAuthor && (
                  <Badge className='ml-2' variant='secondary'>
                   Author
                  </Badge>
                )}
              </p>

              <p className='text-xs text-gray-400'>
                  @{post.user.firstName}
                   {post.user.firstName} - {post.user.userId.toString().slice(-4)}
              </p>

              <p className='text-xs text-gray-400'>
                <ReactTimeago date={new Date(post.createdAt)}/>
              </p>

            </div>

            {isAuthor && (
              <Button variant='outline'
              onClick={() => {
                const promise = deletePostAction(String(post._id));

               
                //toast
                //toast notification
          toast.promise(promise , {
            loading: "deleting the post...",
            success: "Post deleted",
            error : "Failed deleting the post!"
          });
              }}>
                  <Trash2 />
              </Button>
            )}

           </div>
        </div>

      
         <div className=''>
            <p className='px-4 pb-2 mt-2'>{post.text}</p>

            {/**if there is image for the post */}
            {post.imageUrl && (
              <Image
              src={String(post.imageUrl)}
              alt='Post image'
              width={500}
              height={500}
              className='w-full mx-auto'
              /> 
            )}
         </div>

        <PostOptions post={post}/>

    </div>
   
  );
}

export default Post ;