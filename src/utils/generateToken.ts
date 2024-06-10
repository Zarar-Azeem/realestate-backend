import jwt from 'jsonwebtoken'
import env from "../utils/validateEnv"
import { Types } from 'mongoose'
import { CookieOptions, Response } from 'express'

export const generateTokenAndCookie = (res : Response, userId : any) => {

    const token = jwt.sign({userId}, env.JWT_SECRET)

    const cookieOptions: CookieOptions = { httpOnly: true  }

    res.cookie('authToken', token , cookieOptions);

}