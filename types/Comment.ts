import { IUser } from "@/types/User";
import mongoose, { Schema, Document, Model, models } from "mongoose";

// Define the base interface for comments
export interface ICommentBase {
    user: IUser;
    text: string;
}

// Define the full comment document interface, extending the base
export interface IComment extends Document, ICommentBase {
    createdAt: Date;
    updatedAt: Date;
}

// Define the comment schema
const commentSchema = new Schema<IComment>(
    {
        user: {
            userId: { type: String, required: true },
            userImage: { type: String, required: true },
            firstName: { type: String, required: true },
            lastName: { type: String },
        },
        text: { type: String, required: true },
    },
    {
        timestamps: true, // Automatically manage createdAt and updatedAt
    }
);

// Check if the model already exists, otherwise define it
export const Comment = models.Comment || mongoose.model<IComment>("Comment", commentSchema);
