import { NextFunction, Request, RequestHandler, Response } from "express"
import Property from "../models/propertyModel"

type reqBody = {
    title:string,
    body:string,
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

export const createProperty : RequestHandler = async (req: Request ,res: Response , next: NextFunction)=>{
    const {title , body , description } : reqBody= req.body
    
    // description.rooms += 10

    try {
        const property  =  new Property({
            user:req.user,
            title,
            body ,
            description:description
        })

        property.save()

        res.status(201).json(property)
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

        const property = await Property.find({user:req.user})
        
        return res.status(201).json(property)

    } catch (error) {
        console.log("ThIS ONE RIGHT HERE")
        next(error)
    }
}

type Property = {
    user:string,
    title:string,
    body:string,
    description:object
}

export const updateProperty = async (req: Request ,res: Response , next: NextFunction)=>{

    const id : string = req.params.id
    const {title, body , description} : reqBody = req.body

    try{

        let property : Property | null = await Property.findById(id)

        if(property!.user.toString() != req.user){
            return res.status(400).json({message: "Not Allowed"})
        }

        const newProperty : reqBody = {
            title,
            body,
            description
        }

        property = await Property.findByIdAndUpdate(id, {$set: newProperty}, {new: true})
        res.status(201).json(property)
    } catch (error) {
        next(error)
    }
}

export const deleteProperty = async (req: Request ,res: Response , next: NextFunction)=>{

    const id : string = req.params.id

    try{

        let property : Property | null = await Property.findById(id)

        if(property!.user.toString() != req.user){
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