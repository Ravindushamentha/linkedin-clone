'use client';

import { useUser } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { ImageIcon, XIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import createPostAction from '@/actions/createPostAction';
import { toast } from 'sonner';

function PostForm() {
  const ref = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePostAction = async (formData: FormData) => {
    ref.current?.reset();
    
    const text = formData.get("postInput") as string;
    if (!text.trim()) {
      setError("Post input is required!");
      return;
    }
    
    setPreview(null);
    setError(null); // Clear previous errors

    try {
      await createPostAction(formData);
      console.log("Post created successfully!");
    } catch (err) {
      console.error('Error creating the post: ', err);
      setError("Error creating the post, please try again.");
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const { user } = useUser();

  return (
    <div className='mb-2'>
      <form 
        ref={ref} 
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(ref.current!);
         const promise = handlePostAction(formData);

         //toast notification
          toast.promise(promise , {
            loading: "creating post...",
            success: "Post created",
            error : "Failed creating the post!"
          });

        }}
        className='p-2 border bg-white rounded-r-lg'
      >
        <div className='flex space-x-2 items-center'>
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>
              {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <input 
            className='flex-1 outline-none rounded-full py-3 px-4 border'
            type='text'
            name='postInput' // Fixed the name to 'postInput'
            placeholder="What's on your mind?"
          />

          <input
            
            ref={fileInputRef}
            hidden
            type='file'
            name='image'
            accept='image/*'
            onChange={handleImageChange}
          />
          <button type='submit' hidden>Post</button>
        </div>

        {/* Preview condition */}
        {preview && (
          <div className='mt-3'>
            <img src={preview} className='w-full object-cover' alt='preview' />
          </div>
        )}

        {/* Error notification */}
        {error && (
          <p className="text-red-500 mt-2">{error}</p>
        )}

        <div className='flex mt-2 justify-end space-x-2'>
          <Button type='button' variant="secondary" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon className='mr-2' color='currentcolor' size={16}/>
            {preview ? "Change" : "Add"} image
          </Button>

          {/* Remove preview button */}
          {preview && (
            <Button variant={'outline'} type='button' onClick={() => setPreview(null)}>
              <XIcon className='mr-2' size={16} color='currentColor'/>
              Remove Image
            </Button>
          )}
        </div>
      </form>
      <hr className='mt-2 border-gray-300' />
    </div>
  );
}

export default PostForm;
