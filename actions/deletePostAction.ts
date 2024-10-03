'use server'

import { revalidate } from "@/app/page";
import { Post } from "@/Mongodb/models/Post";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function deletePostAction(postId:string) {
    const user = await currentUser();

    if(!user?.id){
        throw new Error("User not authenticated!!!");
    } 

    const post = await Post.findById(postId);

    if(!post) {
        throw new Error("Post not found!!!");
    }

    if(post.user.userId !== user.id) {
        throw new Error("Post not belong to the user!!!");
    }

    try {
        await post.removePost();
        revalidatePath("/")
    } catch (error) {
        throw new Error("Error when deleting the Post!!!");
    }
}