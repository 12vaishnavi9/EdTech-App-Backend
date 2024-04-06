import mongoose from "mongoose";

const courseSchema=new mongoose.Schema({
    course_name:{
        type:String
    },
    slug:{
        type:String,
        lowercase:true
    },
    description:{
        type:String,
    },
    price:{
        type:Number,
    },
    category:{
        type:mongoose.ObjectId,
        ref:"Category",
    },
    lectures:{
        type:Number,
    },
    level:{
        type:String,
        enum:["Beginner","Intermediate","Advanced"]
    },
    popularLevel:{
        type:Number
    }
},{timestamps:true});

export default mongoose.model("Courses",courseSchema)
