import express  from "express";
import {requireAuth} from "../middlewares/authMiddleware"
import * as PropertyController from "../controllers/propertyController";


const router = express.Router()


router.get('/',PropertyController.getProperties)
router.get('/search', PropertyController.searchProperty)
router.get('/getonlyuserproperties', requireAuth, PropertyController.getUserProperties)
router.post('/create' , requireAuth , PropertyController.createProperty)
router.get('/getuserproperty',requireAuth, PropertyController.getUserProperty)
router.get('/getsavedproperty',requireAuth, PropertyController.getSavedProperty)
router.post('/saveproperty',requireAuth, PropertyController.saveProperty)
router.get('/getproperty/:id',requireAuth, PropertyController.getProperty)
router.patch('/update/:id',requireAuth, PropertyController.updateProperty)
router.delete('/delete/:id',requireAuth, PropertyController.deleteProperty)


// router.delete('/deletearrayproperty', PropertyController.deleteArrayProperty)


export default router