import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
        },
        email:{
            type:String,
            unique:true,
        },
        password:{
            type:String,
        },
        status:{
            type:String,
            default:"user",
            enum:["user","admin"]
        },
        photoURL:{
            type:String,
        },
        address:{
            type:String
        }
    },{timestamps:true}
)

export default mongoose.model('userData',userSchema);
