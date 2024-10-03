import connectDB from "@/Mongodb/db";
import { Post } from "@/Mongodb/models/Post";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import {NextResponse} from "next/server";


export async function GET(
    request: Request,
    {params}: {params: {post_id: string}}
){

    await connectDB();

    try {
        const post = await Post.findById(params.post_id);
        if(!post){
            return NextResponse.json({error: "Post not found!!!"}, {status:404});
        }

        return NextResponse.json(post); 
    } catch (error) {
        return NextResponse.json(
            {error: "Error occured when fetching the post!!!"},
            {status: 500}
        );
    }   
}


export interface DeletePostRequestBody { 
    userId: string;
}

export async function DELETE(
    request:Request,
{params}: {params: {post_id: string}}) 
{
 auth().protect();
 
 await connectDB();

 const {userId} : DeletePostRequestBody = await request.json();

 try {
    const post = await Post.findById(params.post_id);

    if(!post){
        return NextResponse.json({error: "Post not found!!!"}, {status:404});
    }
    if(post.user.userId !== userId){
        throw new Error ("Post not belong to the user!!!")
    }

    await post.removePost();

    } catch (error) {
    return NextResponse.json(
        {error: "Error deleting the post!!!"},
        {status: 500} 
    );
    }
 
}
