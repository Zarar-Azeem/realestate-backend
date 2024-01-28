import "dotenv/config";
import express,{ Express } from "express";
import connectToMongoose from "./db";
import env from "./utils/validateEnv";
import { errorHandler, pageNotFoundHandler } from "./utils/errorHandler";
import propertyRouter from "./routes/propertyRoutes";
import userRouter from "./routes/userRoutes";

const app : Express = express()

connectToMongoose()

app.use(express.json())

app.use('/api/property', propertyRouter )
app.use('/api/user', userRouter )

app.use(pageNotFoundHandler)
app.use(errorHandler)

const port  = env.PORT 
app.listen(port , () => console.log(`Server is running at http://localhost:${port}`))