import { NextFunction, Request, Response} from "express"
import jwt from"jsonwebtoken"
import env from "../utils/validateEnv"

declare module 'express-serve-static-core' {
    interface Request{
      user: {
        id: string,
        name: string,
      }
    } 
   
}


export const requireAuth = async (req : Request, res: Response, next: NextFunction)=>{
    const token = req.header('authToken')

    if(!token){
        res.status(401).json({message: "Token is required"})
    }

    try {
        
        const data = jwt.verify(token! , env.JWT_TOKEN) as Request
        req.user = data.user
        next()

    } catch (error) {
        next(error)
    }
}
