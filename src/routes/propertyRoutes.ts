import express  from "express";
import {requireAuth} from "../middlewares/authMiddleware"
import * as PropertyController from "../controllers/propertyController";
import { upload } from "../middlewares/multerMiddleware";


const router = express.Router()


router.get('/',PropertyController.getProperties)
router.get('/search', PropertyController.searchProperty)
router.get('/getonlyuserproperties', requireAuth, PropertyController.getUserProperties)
router.post('/create' , requireAuth, upload.array("pics", 7) , PropertyController.createProperty)
router.get('/getuserproperty',requireAuth, PropertyController.getUserProperty)
router.get('/savedproperties',requireAuth, PropertyController.getSavedProperty)
router.post('/saveproperty/:id',requireAuth, PropertyController.saveProperty)
router.get('/getproperty/:id', PropertyController.getProperty)
router.patch('/update/:id',requireAuth, PropertyController.updateProperty)
router.delete('/delete/:id',requireAuth, PropertyController.deleteProperty)


// router.delete('/deletearrayproperty', PropertyController.deleteArrayProperty)


export default router