import { NextFunction, Request, Response } from "express";

export const errorHandler = (error:unknown, req :Request , res: Response, next: NextFunction)=>{
    let errorMessage = "An Unknown error occured";
    if(error instanceof Error)  errorMessage = error.message
    res.status(500).json({error : errorMessage})
    next()
}

export const pageNotFoundHandler = (req:Request, res:Response  , next:NextFunction)=>{
    next(Error("Not Found"))
}