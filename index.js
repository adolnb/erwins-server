import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';


dotenv.config();
const app = express();
const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        setTimeout(connection, 5000);
    }
};


connection();
app.listen(process.env.PORT);


app.use(cors({
    origin: `${process.env.APP_URL}`,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoutes);
app.use('/api', userRoutes);