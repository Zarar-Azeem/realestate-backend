import express,{ Express, Response, Request } from "express";
import dotenv from "dotenv";

dotenv.config()

const app : Express = express()
const port  = process.env.PORT || 5000


app.get('/', (req:Request,res:Response)=>{
    return "Server is running V1"
})

app.listen(port , () => console.log(`Server is running at http://localhost:${port}`))