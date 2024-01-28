import { NextFunction, Request, Response} from "express"
import jwt from"jsonwebtoken"
import env from "../utils/validateEnv"

declare module 'express-serve-static-core' {
    interface Request{
      user: string
} 
   
}


export const requireAuth = async (req : Request, res: Response, next: NextFunction)=>{
    console.log(req.header('authToken'))
    const token = req.header('authToken')

    if(!token){
        res.status(401).json({message: "Token is required"})
    }
    try {
        console.log("reached Point 1")
        
        const data = jwt.verify(token! , env.JWT_TOKEN) as Request
        console.log("reached Point 2")
        req.user = data.user
        next()

    } catch (error) {
        next(error)
    }
}
