import  express  from "express";
import * as messageController from '../controllers/messageController'
import { requireAuth } from "../middlewares/authMiddleware";

const router = express.Router()

router.get('/:id' , requireAuth ,messageController.getMessages)
router.get('/getmessagedusers', requireAuth, messageController.getMessagedUsers)
router.post('/send/:id' , requireAuth ,messageController.sendMessage)

export default router