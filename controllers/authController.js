import userModel from "../models/userModel.js";
import {comparePassword,hashPassword} from "../helpers/authHelper.js";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import {PASSWORD,EMAIL} from "../env.js";
import Mailgen from "mailgen";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user:process.env.ethereal_name,
      pass:process.env.ethereal_pass
    },
  });

export const registerController = async (req, res) => {
    try {
        const { name, email, password, status } = req.body;
        if (!name || !email || !password || !status) {
            return res.status(400).send({
                success: false,
                message: "All fields are mandatory!",
            });
        }
        const checkUser = await userModel.findOne({ email });
        if (checkUser) {
            return res.status(200).send({
                success: false,
                message: "Already registered please login!",
            });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).send({
                success: false,
                message: "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
            });
        }
        const hashedPassword = await hashPassword(password);
        const user=await new userModel({name,email,password:hashedPassword,status}).save();
        let config = {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        };
        let transporter = nodemailer.createTransport(config);
        let mailGenerator = new Mailgen({
            theme: "default",
            product: {
                name:"EdTech",
                link: "https://mailgen.js/"
            }
        });
        let response = {
            body: {
                name,
                intro: "Welcome to our platform!",
                outro: "Registration Successful"
            }
        };
        let mail = mailGenerator.generate(response);
        let message = {
            from: EMAIL,
            to: user.email,
            subject: "Registration Verification",
            html: mail
        };
        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: 'Error sending email', error });
            }
            console.log('Email sent: ' + info.response);
            res.status(201).json({
                success: true,
                message: "User Registered Successfully!",
                user
            });
        });
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: 'Error in Registration!',
            err
        });
    }
}


export const loginController=async(req,res)=>{
    try{
        const {email,password}=req.body
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Provide both email and password!"
            })
        }
        const user=await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Email is not registered!"
            })
        }
        const match=await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Incorrect Password!"
            })
        }
    const token=await Jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
    res.status(200).send({
        success:true,
        message:"Login successfully!",
        user:{
            email:user.email
        },
        token
    })
    }catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            message:"Error in login!",
            err
        })
    }
}

export const updateProfileController = async (req, res) => {
    try { 
      const { name, email, password, status, photoURL, address } = req.body;
      const {userId}=req.params;
      let user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) user.password = password;
      if (status) user.status = status;
      if (photoURL) user.photoURL = photoURL;
      if (address) user.address = address;
      await user.save();
      res.status(200).json({ success: true, message: "User profile updated successfully.", user });
    } catch (error) {
      console.error("Error while updating user profile:", error);
      res.status(500).json({ success: false, message: "Error while updating user profile.", error: error.message });
    }
  };

  export const getProfileControllerById = async (req, res) => {
    try {
        const {id}=req.params;
      const profile = await userModel.findById(id);
      res.status(200).send({
        success: true,
        message: "Profile fetched",
        profile
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error while getting fetching profile",
      });
    }
  };

  export const resetPasswordController = async (req, res) => {
    try {
        const {email} = req.body;
        if (!email) {
            return res.status(400).send({
                success: false,
                message: "Email is mandatory!",
            });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(200).send({
                success: false,
                message: "User is not registered, can't send mail!",
            });
        }
        const tempPassword = Math.random().toString(36).slice(-8);
        let config = {
            service: 'gmail',
            auth: {
                user: EMAIL,
                pass: PASSWORD
            }
        };
        let transporter = nodemailer.createTransport(config);
        let mailGenerator = new Mailgen({
            theme: "default",
            product: {
                name:"EdTech",
                link: "https://mailgen.js/"
            }
        });
        let response = {
            body: {
                name:user.name,
                intro: "Welcome to our platform!",
                outro: `This is your temporary password: ${tempPassword} 
                Change the password from app.`
            }
        };
        let mail = mailGenerator.generate(response);
        let message = {
            from: EMAIL,
            to: email,
            subject: "Reset Password",
            html: mail
        };
        const hashedPassword = await hashPassword(tempPassword);
        user.password = hashedPassword;
        await user.save();
        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: 'Error sending email', error });
            }
            console.log('Email sent: ' + info.response);
            res.status(201).json({
                success: true,
                message: "Password reset successfully!",
                user
            });
        });
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: 'Error in password reset!',
            err
        });
    }
}

export const changePasswordController = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        // Check if all required fields are provided
        if (!email || !oldPassword || !newPassword) {
            return res.status(400).send({
                success: false,
                message: "Email, old password, and new password are mandatory fields!",
            });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found!",
            });
        }
        const isMatch = await comparePassword(oldPassword,user.password);
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: "Incorrect old password!",
            });
        }
        const hashedPassword=await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).send({
            success: true,
            message: "Password changed successfully!",
        });
    } catch (error) {
        console.error("Error in changePasswordController:", error);
        res.status(500).send({
            success: false,
            message: "Error occurred while changing password.",
            error: error.message
        });
    }
};

  