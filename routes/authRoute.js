import express from "express";
import { registerController,loginController,updateProfileController, getProfileControllerById,
resetPasswordController,changePasswordController} from "../controllers/authController.js";
import {requireSignIn} from "../middlewares/authMiddleware.js";

const router=express.Router();

router.post('/register',registerController);
router.post('/login',loginController);
router.put('/update-profile/:userId',requireSignIn,updateProfileController);
router.get('/get-profile/:id',requireSignIn,getProfileControllerById);
router.post('/reset-password',resetPasswordController);
router.put('/change-password',changePasswordController)

export default router;