import express from "express";
import { createCourseController,updateCourseController,deleteCourseController
,getCourseControllerById,courseController,getCourseByCategoryController,getCoursesByLevelController
,courseListController} from "../controllers/courseController.js";
import { requireSignIn,isAdmin } from "../middlewares/authMiddleware.js";

const router=express.Router();

router.post('/create-course',requireSignIn,isAdmin,createCourseController);
router.put('/update-course/:id',requireSignIn,isAdmin,updateCourseController);
router.get('/get-courses',courseController);
router.get('/get-course/:id',getCourseControllerById);
router.delete('/delete-course/:id',requireSignIn,isAdmin,deleteCourseController);
router.get('/get-course-category/:slug',getCourseByCategoryController);
router.get('/get-courses-level',getCoursesByLevelController);
router.get("/course-list/:page",courseListController);

export default router;