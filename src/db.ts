import mongoose from "mongoose"
import "dotenv/config";
import env from "./utils/validateEnv"

const mongoUri = env.DATABASE_URL

const connectToMongoose = () => {
    mongoose.connect(mongoUri)
    .then(()=>console.log("Connected to Database"))
    .catch(()=>console.log("Error Occurred while connecting to databse"))
}

export default connectToMongoose