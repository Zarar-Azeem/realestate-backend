import "dotenv/config";
var cors = require('cors')
import express,{ Express } from "express";
import connectToMongoose from "./db";
import env from "./utils/validateEnv";
import { errorHandler, pageNotFoundHandler } from "./utils/errorHandler";
import propertyRouter from "./routes/propertyRoutes";
import userRouter from "./routes/userRoutes";
import messageRouter from "./routes/messageRoutes";
import cookieParser from "cookie-parser";


const app : Express = express()

connectToMongoose()

app.use(cors({
    origin: env.CLIENT_URL,
    methods: ['PATCH' , 'DELETE'],
    credentials:true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/property', propertyRouter )
app.use('/api/user', userRouter )
app.use('/api/message', messageRouter )

app.use(pageNotFoundHandler)
app.use(errorHandler)

const port  = env.PORT 
app.listen(port , () => console.log(`Server is running at http://localhost:${port}`))