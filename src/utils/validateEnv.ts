import { cleanEnv} from "envalid";
import {port , str} from "envalid/dist/validators"


export default cleanEnv(process.env, {
    DATABASE_URL: str(),
    PORT: port(),
    JWT_SECRET: str(),
    CLIENT_URL: str(),
    CLOUDINARY_CLOUD_NAME: str(),
    CLOUDINARY_API_KEY: str(),
    CLOUDINARY_API_SECRET: str(),
})