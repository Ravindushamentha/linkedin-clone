"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import generateSASToken, { containerName } from "@/lib/generateSASToken";
import { Post } from "@/Mongodb/models/Post";
import { IUser } from "@/types/User";

import { BlobServiceClient } from "@azure/storage-blob";
import { currentUser } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export default async function createPostAction(formData: FormData) {
  try {
    const user = await currentUser();
    const postInput = formData.get("postInput") as string;
    const image = formData.get("image") as File | null;

    // Ensure postInput is a non-empty string
    if (!postInput || typeof postInput !== 'string' || postInput.trim() === '') {
      throw new Error("Post input is required and must be a non-empty string");
    }

    if (!user?.id) {
      throw new Error("User not authenticated");
    }

    const userDB: IUser = {
      userId: user.id,
      userImage: user.imageUrl,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    };

    let image_url: string | undefined;

    // Handle image upload if present
    if (image && image.size > 0) {
      console.log("Uploading image to Azure Blob Storage...", image);

      const accountName = process.env.AZURE_STORAGE_NAME;
      if (!accountName) {
        throw new Error("Azure storage account name is not configured");
      }

      const sasToken = await generateSASToken();

      const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net?${sasToken}`
      );

      const containerClient = blobServiceClient.getContainerClient(containerName);

      const timestamp = new Date().getTime();
      const file_name = `${randomUUID()}_${timestamp}.png`;

      const blockBlobClient = containerClient.getBlockBlobClient(file_name);

      const imageBuffer = await image.arrayBuffer();
      const res = await blockBlobClient.uploadData(imageBuffer);
      image_url = res._response.request.url;

      console.log("File uploaded successfully!", image_url);
    }

    // Post creation body
    const body: AddPostRequestBody = {
      user: userDB,
      text: postInput.trim(),
      imageUrl: image_url,
    };

    // Create the new post in MongoDB
    const newPost = await Post.create(body);
    console.log("New post created:", newPost);

    // Revalidate the path to ensure updated data is shown
    revalidatePath("/");

    return { success: true, post: newPost };
  } catch (error) {
    console.error("Error in createPostAction:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unknown error occurred" 
    };
  }
}
