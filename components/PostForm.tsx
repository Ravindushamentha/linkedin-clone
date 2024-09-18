'use client'
import { useUser } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { ImageIcon, XIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { error } from 'console';
import createPostAction from '@/actions/createPostAction';

  function PostForm() {
    const ref = useRef<HTMLFormElement>(null);
    const fileInputRef= useRef<HTMLFormElement>(null);
    const [preview , setPreview] = useState< string | null> (null);

    const handlePostAction = async (formData : FormData) => {
      const formDatacopy = formData;
      ref.current?.reset();
      
      const text = formDatacopy.get("Postinput") as string;
      if (!text.trim()){
        throw new Error ("Post input is required!!!")
      }
      setPreview(null);

      try {
        await createPostAction(formDatacopy);

      } catch(error){
        console.log('Error creating the post: ', error)
      };

    }

    const handleImageChange = (event : React.ChangeEvent<HTMLInputElement>  ) => {
      const file = event.target.files?.[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    };
    
    const {user} = useUser();
    
  return (
    <div  className='mb-2'>
        <form ref={ref} action={
          (formdata) => {
            //handle form subbmision with server action
            handlePostAction(formdata);
            //toast notification
          }
        } className='p-2 border bg-white rounded-r-lg'>
            <div className='flex space-x-2 items-center'>
              <Avatar>
                <AvatarImage src={user?.imageUrl }  />
                <AvatarFallback>{user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}</AvatarFallback>
              </Avatar>

              <input 
              
              className='flex-1 outline-none rounded-full py-3 px-4 border'
              type='text'
              name='Postinput'
              placeholder="What's on your mind?"
              />

              <input
              ref = {fileInputRef}
              hidden
              type='file'
              name='image'
              accept='image/*'
              onChange={handleImageChange}
              />
              <button type='submit' hidden>
                Post 
              </button>
            </div>
              {/**preview conditon check */}
                {preview && (
                 <div className='mt-3'>
                  <img src={preview} className='w-full object-cover ' alt='preview'/>
                 </div>
               )}
              {/**preview */}  
            <div className='flex mt-2 justify-end space-x-2'>
                <Button type='button' onClick={() => fileInputRef.current?.click()}>
                  <ImageIcon className='mr-2' color='currentcolor' size={16}/>
                             {preview ? "Change" : "Add"} image
                </Button>

                {/**remove previvew button */}
              { preview && (<Button variant={'outline'} type='button' onClick={() => setPreview(null)}>
                  <XIcon className='mr-2' size={16} color='currentColor'/>
                  Remove Image
                </Button>)}
              </div>

        </form>
        <hr className='mt-2 border-gray-300' />
    </div>
  )
}

export default PostForm