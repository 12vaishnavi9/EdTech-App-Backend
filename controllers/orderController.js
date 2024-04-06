import orderModel from "../models/orderModel.js";
import courseModel from "../models/courseModel.js";
import nodemailer from "nodemailer";
import {PASSWORD,EMAIL} from "../env.js";
import Mailgen from "mailgen";

export const createOrderController = async (req, res) => {
    try {
      const { course, buyer } = req.body;
      const populatedOrder = await orderModel.findOne({ course }).populate('buyer');
      const name=populatedOrder.buyer.name;
      const email=populatedOrder.buyer.email;
    //   const { name, email } = buyer; // Extracting name and email from the buyer object
    //   console.log(email);
      const existingEnrollment = await orderModel.findOne({ course, buyer });
      console.log(existingEnrollment);
      if (existingEnrollment) {
        return res.status(400).json({ success: false, message: "You are already enrolled in this course." });
      }
      const enrollment = new orderModel({ course, buyer });
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
            name,
              intro: `Welcome to our platform, ${name}!`,
              outro: "You have successfully enrolled"
          }
      };
      let mail = mailGenerator.generate(response);
      let message = {
          from: EMAIL,
          to: email, // Using the buyer's email
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
              message: "Enrollment successful.!",
          });
      //await enrollment.save();
    //  res.status(201).json({ success: true, message: "Enrollment successful." });
    })} catch (error) {
      console.error("Error while enrolling in a course:", error);
      res.status(500).json({ success: false, message: "Error while enrolling in a course.", error: error.message });
    }
  };
  

export const getEnrolledCourses = async (req, res) => {
    try {
      const { buyer } = req.params;
      const orders = await orderModel.find({ buyer });
  
      // Extract course IDs from all orders
      const courseIds = orders.reduce((accumulator, order) => {
        accumulator.push(...order.course);
        return accumulator;
      }, []);
  
      // Fetch course details for the enrolled courses
      const enrolledCourses = await courseModel.find({ _id: { $in: courseIds } });
  
      res.status(200).json({ success: true, enrolledCourses });
    } catch (error) {
      console.error("Error while fetching enrolled courses:", error);
      res.status(500).json({ success: false, message: "Error while fetching enrolled courses.", error: error.message });
    }
  };

