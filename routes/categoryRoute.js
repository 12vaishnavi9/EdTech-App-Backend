import express from "express";
import { requireSignIn,isAdmin } from "../middlewares/authMiddleware.js";
import { createCategoryController,updateCategoryController,
    categoryController,getCategoryControllerById,deleteCategoryController} from "../controllers/categoryController.js";

const router=express.Router();

router.post('/create-category',requireSignIn,isAdmin,createCategoryController);
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController);
router.get("/get-category", categoryController);
router.get("/get-category/:id", getCategoryControllerById);
router.delete("/delete-category/:id",requireSignIn,isAdmin,deleteCategoryController)

export default router;