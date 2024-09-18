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
        const likes = post.likes;
        return NextResponse.json(likes); 
    } catch (error) {
        return NextResponse.json(
            {error: "Error occured when fetching likes!!!"},
            {status: 500}
        );
    }   
}


export interface LikePostRequestBody { 
    userId: string;
}

export async function POST(
    request:Request,
{params}: {params: {post_id: string}}) 
{

 auth().protect();
 await connectDB();

 const {userId} : LikePostRequestBody = await request.json();

 try {
    const post = await Post.findById(params.post_id);

    if(!post){
        return NextResponse.json({error: "Post not found!!!"}, {status:404});
    }
    
    await post.likePost(userId);
    return NextResponse.json({message:"Post liked."})

    } catch (error) {
    return NextResponse.json(
        {error: "Error liking the post!!!"},
        {status: 500} 
    );
    }
 
}
