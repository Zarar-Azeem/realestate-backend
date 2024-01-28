import { InferSchemaType, Schema, model } from "mongoose";


const userSchema = new Schema({
    name:{type:String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type: String, required:true}
}, {timestamps:true})

type Property = InferSchemaType<typeof userSchema>

export default model<Property>("user" , userSchema)