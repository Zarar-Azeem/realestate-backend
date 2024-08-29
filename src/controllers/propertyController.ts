import type { NextFunction, Request, RequestHandler, Response } from "express"
import Property from "../models/propertyModel"
import User from "../models/userModel"
import { ObjectId } from "mongodb"
import { getFullSavedProperties } from "../utils/queryFunctions"
import { uploadOnCloudinary } from "../utils/cloudinary"

enum Type {
    RENT = 'rent',
    SELL = 'sell'
}
enum PropertyType {
    LAND = 'land',
    HOUSE = 'house',
    APPARTMENT = 'appartment'
}

type Property = {
    userId:string,
    title:string,
    body:string,
    description:object
}

type reqBody = {
    title:string,
    body:string,
    price:number,
    type: Type,
    propertytype: PropertyType,
    images?:string[]
    location :string,
    bedrooms: number,
    bathrooms: number,
    size: number
    
}

type SearchBody = {
    type: string,
    propertytype: string,
    location: string,
    minPrice: string,
    maxPrice: string,
    bedrooms: string,
}
type Params = {};
type ResBody = {
    
};
type ReqBody = {

}

export const getProperties : RequestHandler =  async (req: Request ,res: Response , next: NextFunction)=>{
    try {
        const properties = await Property.find().exec()
        
        res.status(200).json(properties)
    } catch (error) {
        next(error)
    }
}

export const getUserProperties : RequestHandler =  async (req: Request ,res: Response , next: NextFunction)=>{
    try {

        const properties = await Property.find({userId:req.user?.id}).exec()
        res.status(200).json(properties)
    } catch (error) {
        next(error)
    }
}

export const getSavedProperty = async (req: Request ,res: Response , next: NextFunction)=>{
    const { id } = req.user
    try {
        let properties = await User.findById(id).select('savedProperties')
        const savedProperties = await getFullSavedProperties(properties?.savedProperties)
        return res.status(200).json(savedProperties)
    } catch (error) {
        next(error)
    }
}

export const saveProperty = async (req: Request ,res: Response , next: NextFunction)=>{
    const id : string = req.params.id
    const userId = req.user.id
    try{
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const propertyExists = await Property.findById({_id: id})
        if(!propertyExists){
            return res.status(404).json({ message: 'Property does not exists' });
        }
        
        const savedProperties = user.savedProperties
        const propertyIndex = savedProperties.indexOf(id);
        let property , message;

        if(savedProperties.includes(id)){
            property = savedProperties.splice(propertyIndex, 1);
            message = " Property Removed" 
        } else {
            property = savedProperties.push(id)
            message = " Property Added" 
        }

        await user.save()
        
        return res.status(200).json({message,property: id});

        
        
    } catch (error) {
        next(error)
    }
}


export const searchProperty : RequestHandler<Params, ReqBody , ResBody , SearchBody> = async (req,res, next)=>{
    const query = req.query 
    const type = query.type 
    const propertytype = query.propertytype 
    const bedrooms = query.bedrooms
    const location = query.location 
    const minPrice = query.minPrice ?? 0
    const maxPrice = query.maxPrice ?? 1000000
    console.log(typeof maxPrice , maxPrice)
    let result;
   try{
    let query : any  = { price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) } };

    if (location) {
        query['description.location'] = location;
    }
    if (type) {
        query['type'] = type;
    }
    if (propertytype) {
        query['propertytype'] = propertytype;
    }
    if (bedrooms) {
        query['description.bedrooms'] = bedrooms;
    }
    result = await Property.find(query)
    res.status(200).json(result)
    
   } catch(err){
    next(err)
   }
} 

export const createProperty = async (req: Request ,res: Response , next: NextFunction)=>{
    const { title, body,price,type ,propertytype ,size, bathrooms,bedrooms,location } : reqBody = req.body
    let reqFiles = req.files as any
    let imageUrlList = [];

    if(reqFiles){
        for (var i = 0; i < reqFiles.length; i++) {

            let locaFilePath = reqFiles[i]

            let result  = await uploadOnCloudinary(locaFilePath.path);
            imageUrlList.push(result?.secure_url);
        }
    }
        
    try {
        const property = await Property.create({
            userId:req.user.id,
            title,
            images:imageUrlList,
            price,
            body,
            type,
            property: propertytype,
            description : {
                location,
                bathrooms,
                bedrooms,
                size
        }}) 

        return res.status(201).json({success: true, property})
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const getProperty = async (req: Request ,res: Response , next: NextFunction)=>{
    const id : string = req.params.id
    try{
        const property = await Property.findById({_id: id})
        res.status(201).json(property)
    } catch (error) {
        next(error)
    }
}

export const getUserProperty = async (req: Request ,res: Response , next: NextFunction)=>{
    
    try{

        const property = await Property.find({userId:req.user?.id})
        
        return res.status(201).json(property)

    } catch (error) {
        console.log("ThIS ONE RIGHT HERE")
        next(error)
    }
}



export const updateProperty = async (req: Request ,res: Response , next: NextFunction)=>{

    const id : string = req.params.id
    const {title, body ,price, location,size,bathrooms,bedrooms,} : reqBody = req.body

    try{

        let property : Property | null = await Property.findById(id)

        if(property!.userId.toString() != req.user?.id){
            return res.status(400).json({message: "Not Allowed"})
        }

        const newProperty  = {
            title,
            price,
            body,
            description : {
                location,
                bathrooms,
                bedrooms,
                size
            }
        }

        property = await Property.findByIdAndUpdate(id, {$set: newProperty}, {new: true})
        res.status(201).json({success: true ,property})
    } catch (error) {
        next(error)
    }
}

export const deleteProperty = async (req: Request ,res: Response , next: NextFunction)=>{

    const id : string = req.params.id

    try{

        let property : Property | null = await Property.findById(id)

        if(property!.userId.toString() != req.user!.id){
            return res.status(400).json({message: "Not Allowed"})
        }

        property = await Property.findByIdAndDelete({_id: id})
        res.status(201).json(property)
    } catch (error) {
        next(error)
    }
}

// export const deleteArrayProperty = async (req: Request ,res: Response , next: NextFunction)=>{
//     try{
//         const property = await Property.deleteMany({ description: { $exists: true, $type: 'array' } });
//         res.status(201).json(property)
//     } catch (error) {
//         next(error)
//     }
// }

