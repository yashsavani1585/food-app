import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const stripe = new Stripe(process.env.stripe_secret_key);

// Placing user order from frontend
const placeOrder = async (req, res) => {
    const frontend_url = "https://food-app-frontend1.onrender.com"; // Replace with correct frontend URL

    try {
        // Create a new order in the database
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
        });
        await newOrder.save();

        // Clear the user's cart after placing the order
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        // Create line items for Stripe payment
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100 * 80, // Stripe expects amount in cents
            },
            quantity: item.quantity,
        }));

        // Add delivery charges
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "delivery charges",
                },
                unit_amount: 2 * 100 * 80, // Stripe expects amount in cents
            },
            quantity: 1,
        });

        // Create a Stripe session
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error("Error during order placement:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Verifying the order after payment
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: 'Payment Successful' });
        } else {
            await orderModel.findByIdAndDelete(orderId); // Delete the order if payment failed
            res.json({ success: false, message: 'Payment Failed' });
        }
    } catch (error) {
        console.error("Error during order verification:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Fetch user orders
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Fetch all orders for admin
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log("Error fetching orders:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update order status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
