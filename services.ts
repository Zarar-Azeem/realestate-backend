import { Request, Response } from "express"

export const  users = (req :Request, res : Response) => {
    res.send('All users')
}
  
export const  articles = (req :Request, res : Response) => {
    res.send('All articles')
}