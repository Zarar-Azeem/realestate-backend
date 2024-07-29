import mongoose , { InferSchemaType, model, Schema } from "mongoose";



const MessageSchema =  new Schema({
    reciever: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    sender: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    message: { type: String, required: true }
  }, { timestamps: true  }
);

type Message = InferSchemaType<typeof MessageSchema>

export default model<Message>("message", MessageSchema);