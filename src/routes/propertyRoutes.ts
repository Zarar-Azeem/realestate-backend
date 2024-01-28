import express  from "express";
import {requireAuth} from "../middlewares/authMiddleware"
import * as PropertyController from "../controllers/propertyController";


const router = express.Router()


router.get('/', PropertyController.getProperties)
router.post('/create',requireAuth, PropertyController.createProperty)
router.get('/getuserproperty',requireAuth, PropertyController.getUserProperty)
router.post('/getproperty/:id',requireAuth, PropertyController.getProperty)
router.put('/updateproperty/:id',requireAuth, PropertyController.updateProperty)
router.delete('/deleteproperty/:id',requireAuth, PropertyController.deleteProperty)



// router.delete('/deletearrayproperty', PropertyController.deleteArrayProperty)


export default router