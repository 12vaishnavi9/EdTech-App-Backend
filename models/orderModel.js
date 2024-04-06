import mongoose from "mongoose";

const orderSchema=new mongoose.Schema({
   course:[
    {
        type:mongoose.ObjectId,
        ref:"Courses"
    }
   ],
   buyer:{
    type:mongoose.ObjectId,
    ref:"userData"
   }
},
{timestamps:true})

export default mongoose.model('Order',orderSchema);