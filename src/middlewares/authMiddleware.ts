import { NextFunction, Request, Response} from "express"
import jwt, { JwtPayload } from"jsonwebtoken"
import env from "../utils/validateEnv"
import User from '../models/userModel'
declare module "express-serve-static-core" {
    interface Request {
        user: {
            id: string
        }
    }
 }

export const requireAuth = async (req : Request, res: Response, next: NextFunction)=>{
    console.log("This ran")
    console.log(req.cookies.authToken)
    const token = req.cookies.authToken
    if(!token){
        return res.status(401).json({message: "Not Authorized"})
    }
    console.log("This ran too")
    try {
        
        const data = jwt.verify(token! , env.JWT_SECRET) as {userId : string}
        req.user  = await User.findById(data.userId).select("-password") as {id : string }
        console.log("This ran too00000000")
        next()

    } catch (error) {
        next(error)
    }
}
