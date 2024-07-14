import mongoose, { InferSchemaType, Schema, model } from "mongoose";


const userSchema = new Schema({
    name:{type:String, required:true},
    email: {type:String, required:true, unique:true},
    number: {type:Number,  unique:true},
    password: {type: String, required:true},
    avatar: { type: String },
}, {timestamps:true})

type Property = InferSchemaType<typeof userSchema>

export default model<Property>("user" , userSchema)