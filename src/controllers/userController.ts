import bcrypt from "bcrypt"
import { NextFunction, Request, RequestHandler, Response } from "express"
import User from "../models/userModel"
import { generateTokenAndCookie } from "../utils/generateToken"
import { uploadOnCloudinary } from "../utils/cloudinary"

type registerUser = {
    name: string
    email:string
    password:string
    phonenumber:string
}

export const registerUser : RequestHandler = async (req :Request, res: Response , next : NextFunction)=>{

    const  {name, email, password } : registerUser = req.body
    
    try {

        let success = false

        if(!name || !email || !password){
            return res.status(401).json({success, message:"Please enter all fields"})
        }

        let  user = await User.findOne({email})
        if(user){
            return res.status(401).json({success, message: "Email is already taken"})
        }

        const salt = await bcrypt.genSalt(10)
        const secpass : string = await bcrypt.hash(password , salt)

        user = await User.create({
            name,
            email,
            password: secpass
        })

        success = true
        
        generateTokenAndCookie(res , user._id)

        res.status(201).json({success ,
             user: {
                id: user._id,
                name: user.name,
                email: user.email,
             }})


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

        success = true
        
        generateTokenAndCookie(res , user._id)

        res.status(201).json({success , user: {
            id: user._id,
            name: user.name,
            email: user.email,
            number: user?.number,
            avatar: user?.avatar
        }})

    } catch (error) {
        next(error)
    }

}

export const logOutUser : RequestHandler =async (req :Request, res: Response , next: NextFunction) => {
    try {
        res.cookie('authToken', '', { maxAge: 0, httpOnly: true, expires: new Date(0) })
        res.status(200).json({message: "Logged out successfully"})
    } catch (error) {
        next(error)
    }
}

type GetUser = {
    _id: string
    name:string,
    email:string,
    number: number,
    avatar: string
} | null

export const getAuthUser : RequestHandler = async (req :Request, res: Response , next: NextFunction) => {
        try {
            const user : GetUser = await User.findById(req.user!.id)
            res.status(201).send({
                id:user?._id,
                name: user?.name,
                email: user?.email, 
                number: user?.number,
                avatar: user?.avatar
                })
            
        } catch (error) {
            next(error)
        }
}
export const getUser : RequestHandler = async (req :Request, res: Response , next: NextFunction) => {
        const { id } = req.params
        try {
            const user : GetUser = await User.findById(id)
            res.status(201).send({
                id:user?._id,
                name: user?.name,
                email: user?.email, 
                number: user?.number,
                avatar: user?.avatar
                })
            
        } catch (error) {
            next(error)
        }
}


export const updateUser = async (req :Request, res: Response , next: NextFunction)=>{
    const {name, email, number, password} = req.body
    const avatarLocalPath = req.file?.path;
    console.log(req.file)
    console.log(avatarLocalPath) 
    try {

        let user = await User.findById(req.user.id)
        if(!user){
            return res.status(400).json({message: "User not found"})
        }

        let newName = await User.findOne({name})

        if(newName){
            if(user.name === name) {
                user.name = name
            } else {    
                return res.status(400).json({message: "Name is already taken"})
            }
        }

        let newEmail = await User.findOne({email})
        if(newEmail){
            if(user.email === email) {
                user.email = email
            } else {    
                return res.status(400).json({message: "Email is already taken"})
            }
        }

        if(password){
            const salt = await bcrypt.genSalt(10)
            const secpass : string = await bcrypt.hash(password, salt)
            user.password =  secpass || user.password
        }

        const upload = await uploadOnCloudinary(avatarLocalPath);


        user.name = name || user.name
        user.email = email || user.email
        user.number = number || user.number
        user.avatar = upload?.secure_url || user.avatar

        await user.save()

        res.status(201).json({success:true ,message: "User updated successfully"})
        
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req :Request, res: Response , next: NextFunction)=>{
    try{
        const user = await User.findByIdAndDelete(req.user.id)
        res.status(201).send({
            message: "User deleted successfully",
            user:{
                name: user?.name,
                email: user?.email, 
                number: user?.number,
                }
            })
    } catch (error) {
        next(error)
    }
}

export const uploadAvatar = async (req :Request, res: Response , next: NextFunction)=>{
    const avatarLocalPath = req.file?.path;
    console.log(req.file?.path)
    console.log(req.files)
}