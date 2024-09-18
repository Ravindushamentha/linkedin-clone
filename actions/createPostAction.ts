'use server'

import { AddPostReqestBody } from "@/app/api/posts/route";
import { Post } from "@/Mongodb/models/Post";
import { IUser } from "@/types/User";
import { currentUser } from "@clerk/nextjs/server"
import { error } from "console";
import { stringify } from "querystring";

export default async function createPostaction(formdata:FormData) {
    const user = await currentUser();
    if(!user) {
        throw new Error ("User not authenticated!!!");
    }
    const Postinput = formdata.get('Postinput') as string ;
    const image = formdata.get('image') as File ;
    let imageURL : string | undefined ; 
    
    if (!Postinput ){
        throw new Error ('Must provide a Post Input!!!');
    }

    //define user
    const userDB : IUser = {
        userId:    user.id,
        userImage: user.imageUrl,
        firstName: user.firstName || "",
        lastName: user.lastName || "" ,
    };

    try {
        if(image.size > 0){
    // 1 . upload the image if there is - MS blob storage
    
    // 2. create post in database with image
    const body: AddPostReqestBody = {
        user : userDB,
        text: Postinput,
        //imageUrl: image_url,
    };
    } else{
    //create post in database without image
        const body: AddPostReqestBody = {
            user : userDB,
            text: Postinput,
        };
        await Post.create(body);
    }
    } catch (error: any) {
        throw new Error("Post creation failed!!!", error);
    }
    

    

    //revalidate home page

 };