import mongoose, { InferSchemaType, model, Schema } from "mongoose";


const chatSchema = new Schema({
    participants:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
    ],
    messages:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'message',
        default:[]
    }
    ],
})

type Chat = InferSchemaType<typeof chatSchema>

export default model<Chat>("chat", chatSchema);