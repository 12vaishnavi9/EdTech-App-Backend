import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import courseRoute from "./routes/courseRoute.js";
import orderRoute from "./routes/orderRoute.js";
import cors from "cors";
import expressListEndpoints from 'express-list-endpoints';

dotenv.config();
const app = express();

connectDB();
app.use(express.static('public'));
app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/category',categoryRoute);
app.use('/api/v1/course',courseRoute);
app.use('/api/v1/order',orderRoute);

const endpoints = expressListEndpoints(app);
console.log(endpoints);

const PORT=process.env.PORT || 8080
app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`)
})



