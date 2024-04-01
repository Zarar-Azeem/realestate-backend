import mongoose, { InferSchemaType, Schema, model } from "mongoose";


const propertySchema = new Schema({
    
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    title: {type:String, required: true},
    body:String,
    description:{
        rooms:Number,
        bathrooms:Number,
        area: Number,
        location: String
    }
}, {timestamps:true})

type Property = InferSchemaType<typeof propertySchema>

export default model<Property>("property" , propertySchema)