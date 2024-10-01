import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js'; // Ensure this path is correct
import dotenv from 'dotenv';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to the database
connectDB();

// api end point

app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'));
app.use('/api/user',userRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)

// Route
app.get('/', (req, res) => {
    res.send('Welcome to the Food App API');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
