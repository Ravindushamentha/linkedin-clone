import { Comment, Icomment, ICommentBase } from "@/types/Comment";
import { IUser } from "@/types/User";
import mongoose, { Schema, Document, Model, models } from "mongoose";

export interface IPostBase {
    user: IUser;
    text: string;
    imageURL?: string[]; // Updated to string array or string as appropriate
    likes?: string[];
}

export interface IPost extends IPostBase, Document {
    createdAt: Date;
    updatedAt: Date;
}

// Define document methods for each instance of a post
interface IPostMethods {
    likePost(userId: string): Promise<void>;
    unLikePost(userId: string): Promise<void>;
    commentOnPost(comment: ICommentBase): Promise<void>;
    getAllComment(): Promise<Icomment[]>;
    removePost(): Promise<void>;
}

interface IPostStatics {
    getAllPosts(): Promise<IPostDocument[]>; // Renamed to avoid conflict
}

export interface IPostDocument extends IPost, IPostMethods {
    comments: any;
} // Singular instance of a post

interface IPostModel extends IPostStatics, Model<IPostDocument> {} // All posts

const PostSchema = new Schema<IPostDocument>(
    {
        user: {
            userId: { type: String, required: true },
            userImage: { type: String, required: true },
            firstName: { type: String, required: true },
            lastName: { type: String },
        },
        text: { type: String, required: true },
        imageURL: { type: [String] }, // Updated to string array
        comments: { type: [Schema.Types.ObjectId], ref: "Comment", default: [] },
        likes: { type: [String], default: [] }, // Updated to string array
    },
    {
        timestamps: true,
    }
);

PostSchema.methods.likePost = async function (userId: string) {
    try {
        await this.updateOne({ $addToSet: { likes: userId } }); // Fixed typo
    } catch (error) {
        console.log("Can't like the post!!!", error);
        throw error;
    }
};

PostSchema.methods.unLikePost = async function (userId: string) {
    try {
        await this.updateOne({ $pull: { likes: userId } });
    } catch (error) {
        console.log("Can't unlike the post!!!", error);
        throw error;
    }
};

PostSchema.methods.removePost = async function () {
    try {
        await this.model("Post").deleteOne({ _id: this._id });
    } catch (error) {
        console.log("Can't remove the post!!!", error);
        throw error;
    }
};

PostSchema.methods.commentOnPost = async function (commentToAdd: ICommentBase) {
    try {
        const comment = await Comment.create(commentToAdd);
        this.comments.push(comment._id);
        await this.save();
    } catch (error) {
        console.log("Can't comment on the post!!!", error);
        throw error;
    }
};

PostSchema.methods.getAllComment = async function () {
    try {
        await this.populate({
            path: "comments",
            options: { sort: { createdAt: -1 } }, // Sort comments by the newest one
        });
        return this.comments;
    } catch (error) {
        console.log("Can't get all the comments on the post!!!", error);
        throw error;
    }
};

PostSchema.statics.getAllPosts = async function () { // Renamed method to avoid conflict
    try {
        const posts = await this.find()
            .sort({ createdAt: -1 })
            .populate({
                path: "comments",
                options: { sort: { createdAt: -1 } }, // Sort comments by the newest one
            })
            .lean(); // Converts mongoose objects into plain JS

        return posts.map((post: IPostDocument) => ({
            ...post,
            _id: post._id.toString(),
            comments: post.comments?.map((comment: Icomment) => ({
                ...comment,
                _id: comment._id.toString(),
            })),
        }));
    } catch (error) {
        console.log("Error fetching posts!", error);
        throw error;
    }
};

export const Post = models.Post as IPostModel || mongoose.model<IPostDocument, IPostModel>("Post", PostSchema);
