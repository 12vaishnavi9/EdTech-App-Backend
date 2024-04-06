import courseModel from "../models/courseModel.js";
import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCourseController = async (req, res) => {
    try {
      const { course_name,description,price,category,lectures,level,popularLevel } =
        req.body;
      switch (true) {
        case !course_name:
          return res.status(500).send({ error: "Course name is Required" });
        case !description:
          return res.status(500).send({ error: "Description is Required" });
        case !price:
          return res.status(500).send({ error: "Price is Required" });
        case !category:
          return res.status(500).send({ error: "Category is Required" });
        case !lectures:
          return res.status(500).send({ error: "Lectures is Required" });
          case !level:
            return res.status(500).send({ error: "Level is Required" });
            case !popularLevel:
          return res.status(500).send({ error: "PopularLevel is Required" });
      }
  
      const course = new courseModel({course_name,slug:slugify(course_name),description,price,category,lectures,level,popularLevel});
      await course.save();
      res.status(201).send({
        success: true,
        message: "Course Created Successfully",
        course,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in crearing course",
      });
    }
  };

  export const updateCourseController = async (req, res) => {
    try {
        const { id } = req.params;
        const { course_name, description, price, category, lectures, level, popularLevel } = req.body;
        switch (true) {
          case !course_name:
            return res.status(500).send({ error: "Course name is Required" });
          case !description:
            return res.status(500).send({ error: "Description is Required" });
          case !price:
            return res.status(500).send({ error: "Price is Required" });
          case !category:
            return res.status(500).send({ error: "Category is Required" });
          case !lectures:
            return res.status(500).send({ error: "Lectures is Required" });
            case !level:
              return res.status(500).send({ error: "Level is Required" });
              case !popularLevel:
            return res.status(500).send({ error: "PopularLevel is Required" });
        }
        const update = {
            course_name,
            slug: slugify(course_name),
            description,
            price,
            category,
            lectures,
            level,
            popularLevel
        };

        const course = await courseModel.findByIdAndUpdate(id, update, { new: true });
        res.status(200).send({
            success: true,
            message: "Course Updated Successfully",
            course
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "Error while updating the Course",
            err
        });
    }
};

export const getCourseControllerById = async (req, res) => {
  try {
      const {id}=req.params;
    const course = await courseModel.findById(id);
    res.status(200).send({
      success: true,
      message: "Course fetched",
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting fetching Course",
    });
  }
};

export const courseController = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    };

    const courses = await courseModel.paginate({}, options);

    if (!courses || courses.docs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      courses: courses.docs,
      totalPages: courses.totalPages,
      totalCourses: courses.totalDocs
    });
  } catch (error) {
    console.error("Error while getting all courses:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error while getting all courses",
    });
  }
};

export const deleteCourseController=async(req,res)=>{
  try{
      const {id}=req.params;
      await courseModel.findByIdAndDelete(id)
      res.status(200).send({
          success:true,
          message:"Course Deleted Successfully"
      })
  }catch(err){
      console.log(err)
      res.status(500).send({
          success:false,
          message:"Error while deleting Course",
          err
      })
  }
}

export const getCourseByCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).send({
          success: false,
          message: "Category not found",
      });
    }

    const courses = await courseModel.find({ category: category._id }).populate("category");

    if (!courses || courses.length === 0) {
      return res.status(404).send({
          success: false,
          message: "No courses found for the provided category",
      });
    }

    res.status(200).send({
      success: true,
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error while getting courses",
    });
  }
};

export const getCoursesByLevelController = async (req, res) => {
  try { 
      const { level ,page=1,limit=5} = req.query;
      const filter = {};
      if (level) {
          filter.level = level;
      }
      const options = {
        page: parseInt(page, 5),
        limit: parseInt(limit, 5)
      };
  //    const courses = await courseModel.find(filter);
  const courses = await courseModel.paginate(filter,options);
      if (!courses || courses.length === 0) {
          return res.status(404).json({
              success: false,
              message: "No courses found with the provided filtering options",
          });
      }
      res.status(200).json({
          success: true,
          message: "Courses fetched successfully",
          courses,
      });
  } catch (error) {
      console.error("Error while fetching courses:", error);
      res.status(500).json({
          success: false,
          message: "Error while fetching courses",
          error: error.message,
      });
  }
};

export const courseListController = async (req, res) => {
  try {
    const perPage = 5
    const page = req.params.page ? req.params.page : 1
    const course = await courseModel.find({})
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ popularLevel: 1 });
    res.status(200).send({
      success:true,
      course
    })
  } catch (err) {
    res.status(500).send({
      success: true,
      message: "Error while getting course",
      err
    })
  }
}




