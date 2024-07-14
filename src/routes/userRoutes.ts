import express  from "express";
import * as userController from "../controllers/userController";
import { requireAuth } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerMiddleware";


const router = express.Router()


router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.post('/logout',requireAuth , userController.logOutUser)
router.patch('/updateuser',requireAuth , upload.single("avatar"),  userController.updateUser)
router.delete('/deleteuser', requireAuth , userController.deleteUser)
router.get('/getauthuser', requireAuth ,userController.getAuthUser)
router.get('/getuser/:id', requireAuth ,userController.getUser)
router.post('/upload', requireAuth, upload.single('avatar') ,userController.uploadAvatar)




export default router