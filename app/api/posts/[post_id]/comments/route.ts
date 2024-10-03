import connectDB from "@/Mongodb/db";
import { Post } from "@/Mongodb/models/Post";
import { ICommentBase } from "@/types/Comment";
import { IUser } from "@/types/User";
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
        const comments = post.getAllComments();
        return NextResponse.json(comments); 
    } catch (error) {
        return NextResponse.json(
            {error: "Error occured when fetching comments!!!"},
            {status: 500}
        );
    }   
}


export interface AddCommentRequestBody { 
    user: IUser;
    text: string;
}

export async function POST(
    request:Request,
{params}: {params: {post_id: string}}) 
{

 auth().protect();
 await connectDB();

 const {user,text} : AddCommentRequestBody = await request.json();

 try {
    const post = await Post.findById(params.post_id);

    if(!post){
        return NextResponse.json({error: "Post not found!!!"}, {status:404});
    }

    const comment: ICommentBase = {
        user,
        text,
    }

    await post.commentOnPost(comment);
    return NextResponse.json({message:"Comment Added."})

    } catch (error) {
    return NextResponse.json(
        {error: "Error commenting on the post!!!"},
        {status: 500} 
    );
    }
 
}
