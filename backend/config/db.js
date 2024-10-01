import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB database
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connection successfully"); // Log on success
    } catch (error) {
        console.error("DB Connection failed:", error.message); // Log the error message
        process.exit(1); // Exit the process if the connection fails
    }
};
 