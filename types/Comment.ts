import { IUser } from "@/types/User";
import mongoose,{Schema,Document, Model, models} from "mongoose";

export interface ICommentBase{
    user : IUser;
    text : string;
}

export interface Icomment extends Document, ICommentBase {
    createdAt : Date;
    updatedAt: Date;
}

const commentScema = new Schema<Icomment>(
    {

        user : {
            userId:    {type: String, required: true},
            userImage: {type: String, required: true},
            firstName: {type: String, required: true},
            lastName:  {type: String},
        },
        text :    {type: String, required: true},
    },
    {
        timestamps : true,
    }
);

export const Comment = models.Comment || mongoose.model<Icomment>("Comment",commentScema);
