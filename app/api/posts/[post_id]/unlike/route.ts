import connectDB from "@/Mongodb/db";
import { Post } from "@/Mongodb/models/Post";
import { auth } from "@clerk/nextjs/server";
import { error } from "console";
import {NextResponse} from "next/server";

export interface UnlikePostRequestBody { 
    userId: string;
}

export async function POST(
    request: Request,
    {params}: {params: {post_id: string}}
){
   await connectDB();
    
   const {userId} : UnlikePostRequestBody = await request.json();

    try { 
        const post = await Post.findById(params.post_id);
        if(!post){
            return NextResponse.json({error: "Post not found!!!"}, {status:404});
        }
        
         await post.unlikePost(userId);
         return NextResponse.json({message:"Post unliked."})
    } catch (error) {
        return NextResponse.json(
            {error: "Error occured when unliking!!!"},
            {status: 500}
        );
    }   
}




