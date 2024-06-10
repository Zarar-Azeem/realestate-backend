import type { NextFunction, Request, RequestHandler, Response } from "express"
import Property from "../models/propertyModel"
import User from "../models/userModel"
import { ObjectId } from "mongodb"
import { getBedrooms, getLocation } from "../utils/queryFunctions"

type reqBody = {
    title:string,
    body:string,
    price:number,
    description: object
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
    try {
        const propertiesIds = await User.findById(req.user.id).populate('savedProperty');
        const properties = getFullSavedProperties(propertiesIds?.savedProperty ?? [])
        res.status(200).json(properties)
    } catch (error) {
        next(error)
    }
}

export const saveProperty = async (req: Request ,res: Response , next: NextFunction)=>{
    const id : string = req.params.id
    try{
        const property = await Property.findById({_id: id}).select('_id')
        await User.findByIdAndUpdate(req.user.id, {$push: {savedProperty: property}})
        res.status(201).json(property)
    } catch (error) {
        next(error)
    }
}

type SearchBody = {
    type: string,
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

export const searchProperty : RequestHandler<Params, ReqBody , ResBody , SearchBody> = async (req,res, next)=>{
    const body = req.body  as SearchBody
    const bedrooms = body.bedrooms
    const location = body.location
    const minPrice = body.minPrice ?? 0
    const maxPrice = body.maxPrice ?? 1000000
    console.log(typeof maxPrice , maxPrice)
    let result;
   try{
    console.log('1')
    result = await Property.find().where({ price: { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) } })
    result = getLocation(result , location)
    console.log('2')
    result = getBedrooms(result , bedrooms)
    res.status(200).json(result)
    
   } catch(err){
    console.log('dsa')
    next(err)
   }
} 

export const createProperty : RequestHandler = async (req: Request ,res: Response , next: NextFunction)=>{
    const {title , body , description,price } : reqBody = req.body
    
    // description.rooms += 10

    try {
        const property = await Property.create({
            userId:req.user.id,
            title,
            price,
            body,
            description : description
        }) 

        res.status(201).json({success: true, property})
    } catch (error) {
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

type Property = {
    userId:string,
    title:string,
    body:string,
    description:object
}

export const updateProperty = async (req: Request ,res: Response , next: NextFunction)=>{

    const id : string = req.params.id
    const {title, body ,price, description} : reqBody = req.body

    try{

        let property : Property | null = await Property.findById(id)

        if(property!.userId.toString() != req.user?.id){
            return res.status(400).json({message: "Not Allowed"})
        }

        const newProperty : reqBody = {
            title,
            price,
            body,
            description
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


const getFullSavedProperties = async (propertyIds : ObjectId[]) => {
    try {
      const savedPosts = await Property.find({ _id: { $in: propertyIds } });
      return savedPosts;
    } catch (error) {
      console.error(error);
      return null;
    }
  };