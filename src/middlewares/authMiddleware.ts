import { NextFunction, Request, Response} from "express"
import jwt, { JwtPayload } from"jsonwebtoken"
import env from "../utils/validateEnv"
import User from '../models/userModel'
declare module "express-serve-static-core" {
    interface Request {
        user: any
    }
 }

export const requireAuth = async (req : Request, res: Response, next: NextFunction)=>{
    const token = req.cookies.authToken
    if(!token){
        res.status(401).json({message: "Not Authorized"})
    }

    try {
        
        const data = jwt.verify(token! , env.JWT_SECRET) as {userId : string}
        req.user  = await User.findById(data.userId).select("-password") as {id : string }
        next()

    } catch (error) {
        next(error)
    }
}
