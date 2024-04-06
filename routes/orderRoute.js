import express from "express";
import {createOrderController,getEnrolledCourses} from "../controllers/orderController.js";
import { requireSignIn,isAdmin } from "../middlewares/authMiddleware.js";

const router=express.Router();

router.post('/create-order',requireSignIn,createOrderController);
router.get('/get-orders/:buyer',requireSignIn,getEnrolledCourses);

export default router;