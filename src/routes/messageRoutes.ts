import  express  from "express";
import * as messageController from '../controllers/messageController'
import { requireAuth } from "../middlewares/authMiddleware";

const router = express.Router()

router.get('/go' , requireAuth, messageController.getMessagedUsers)
router.get('/:id' , requireAuth ,messageController.getMessages)
router.post('/send' , requireAuth ,messageController.sendMessage)

export default router