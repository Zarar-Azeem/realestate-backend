import express  from "express";
import * as userController from "../controllers/userController";
import { requireAuth } from "../middlewares/authMiddleware";


const router = express.Router()


router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.post('/logout', userController.logOutUser)
router.patch('/updateuser', requireAuth, userController.updateUser)
router.delete('/deleteuser', requireAuth, userController.deleteUser)
router.get('/getauthuser', requireAuth ,userController.getAuthUser)
router.get('/getuser/:id', requireAuth ,userController.getUser)




export default router