// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.stripe_secret_key);


// // placing user order from frontend

// const placeOrder = async (req,res)=> {

//     const frontend_url = "http://localhost:5173";


//         try {
//             // Create a new order in the database
//             const newOrder = new orderModel({
//                 userId: req.body.userId,
//                 items: req.body.items,
//                 amount: req.body.amount,
//                 address: req.body.address,
//             });
//             await newOrder.save();

//             // Clear the user's cart after placing the order
//             await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//             // Create line items for Stripe payment
//             const line_items = req.body.items.map((item) => ({
//                 price_data: {
//                     currency: "inr",
//                     product_data: {
//                         name: item.name,
//                     },
//                     unit_amount: item.price * 100*80, // Stripe expects amount in cents
//                 },
//                 quantity: item.quantity,
//             }));

//             line_items.push({
//                 price_data:{
//                     currency:"inr",
//                     product_data:{
//                         name: "delivery charges",
//                     },
//                     unit_amount: 2*100*80, // Stripe expects amount in cents
//                 },
//                 quantity: 1,
//             })

//             const session = await stripe.checkout.sessions.create({
//                 line_items:line_items,
//                 mode:'payment',
//                 success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//                 cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,

//             })
//             res.json({ success: true, session_url:session.session.url });


//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Server Error' });

//     }


// }

// export {placeOrder}

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const stripe = new Stripe(process.env.stripe_secret_key);

// Placing user order from frontend
const placeOrder = async (req, res) => {
    const frontend_url = "https://food-app-frontend-2.onrender.com";

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

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

// const verifyOrder = async (req, res) => {
//     const {orderId,success} = req.body;
//     try {
//         if (success == "true") {
//             await orderModel.findByIdAndUpdate(orderId,{payment:true});
//             res.json({ success: true, message: 'Payment Successful' });
//         }
//         else{
//             await orderModel.findByIdAndDelete(orderId,{payment:false});
//             res.json({ success: false, message: 'Payment Failed' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: 'Server Error' });
//     }
// }

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: 'Payment Successful' });
        } else {
            await orderModel.findByIdAndDelete(orderId); // Removed {payment: false}
            res.json({ success: false, message: 'Payment Failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// user order api

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// admin order api

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// api for updating for order status updates

const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status});
        res.json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export { placeOrder, verifyOrder, userOrders,listOrders,updateStatus };
