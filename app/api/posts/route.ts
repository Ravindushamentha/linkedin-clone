import connectDB from "@/Mongodb/db";
import { IPostBase, Post } from "@/Mongodb/models/Post";
import { IUser } from "@/types/User";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export interface AddPostReqestBody { 
    user: IUser , 
    text:string,
    imageUrl?: string | null;
}

export async function POST(request:Request) {
    auth().protect();  //protect the route with clerk

    try {
         await connectDB();   
          
         const{user, text, imageUrl}: AddPostReqestBody = await request.json(); 

    const postData : IPostBase = {
        user,
        text,
        ...(imageUrl && {imageUrl}),
    };
    const post = await Post.create(postData);
    return NextResponse.json({message: "Post created.",post})

    } catch (error) {
        return NextResponse.json(
            {error: `Error when creating the post!!! ${error}`},
            {status: 500},
        );
    }

}


export async function GET(request:Request) {
    try {
        await connectDB();

        const posts = await Post.getAllPosts();

        return NextResponse.json({posts});
    } catch (error) {
        return NextResponse.json(
            {error: "Error when fething the posts!!!"},
            {status: 500},
        );
    }
}