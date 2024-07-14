import mongoose, { InferSchemaType, Schema, model } from "mongoose";


const propertySchema = new Schema({
    
    userId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    title: {type: String, require:true} ,
    body: String,
    price: Number,
    images:[{type: String, require:true}],
    saved: {type:Boolean , default:false},
    description: {
        bedrooms:Number,
        bathrooms:Number,
        size: Number,
        location: String
    }
}, {timestamps:true})

type Property = InferSchemaType<typeof propertySchema>

export default model<Property>("property" , propertySchema)