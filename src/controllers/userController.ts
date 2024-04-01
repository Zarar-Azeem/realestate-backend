import bcrypt from "bcrypt"
import { NextFunction, Request, RequestHandler, Response } from "express"
import jwt from "jsonwebtoken"
import User from "../models/userModel"
import env from "../utils/validateEnv"

type registerUser = {
    name: string
    email:string
    password:string
}

export const registerUser : RequestHandler = async (req :Request, res: Response , next : NextFunction)=>{

    const  {name, email, password} : registerUser = req.body
    
    try {

        let success = false

        if(!name || !email || ! password){
            return res.status(401).json({success, message:"Please enter all fields"})
        }

        let  user = await User.findOne({email})
        if(user){
            return res.status(400).json({success, message: "Email is already taken"})
        }

        const salt = await bcrypt.genSalt(10)
        const secpass : string = await bcrypt.hash(password , salt)

        user = await User.create({
            name,
            email,
            password:secpass
        })

        const payload = {
            id: user._id,
            name: name
        }

        const token = jwt.sign({user:payload}, env.JWT_TOKEN)


        success = true

        return res.status(201).json({success , message: "User created Succesfully", token})


    } catch (error) {
        next(error)
    }
}

type loginUser = {
    email:string
    password:string
}

export const loginUser : RequestHandler = async (req :Request, res: Response , next: NextFunction)=>{

    const  {email, password} : loginUser = req.body

    try {

        let success = false

        if(!email || !password){
            return res.status(401).json({success, message:"Please enter all fields"})
        }

        const user = await User.findOne({email})

        if (!user) {
            return res.status(401).json({success , message : "Enter correct credentials"})
        }

        const passCheck = await bcrypt.compare(password, user.password)
        
        if(!passCheck){
            return res.status(401).json({success , message : "Enter correct credentials"})
        }

        const payload = {
            id: user._id,
            name: user.name
        }

        const token = jwt.sign({user:payload}, env.JWT_TOKEN)

        success = true

        return res.status(201).json({success, message:"Logged in Successfully", token})

    } catch (error) {
        next(error)
    }

}
