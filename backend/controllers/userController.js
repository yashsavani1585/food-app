import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import dotenv from 'dotenv';


// login user

const loginUser = async (req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email: email});
        if(!user){
            return res.json({success: false, message:"User not found"})
        }

        // compare password
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.json({success: false, message:"Invalid password"})
        }

        // generate token
        const token = createToken(user._id);
        res.json({success: true, message:"Logged in successfully", token:token})
    } catch (error) {
        console.error(error)
        res.status(500).json({success: false, message:"Server error"})
    }

}

const createToken = (id) => {
    return jwt.sign({id:id}, process.env.jwt_secret)
}

// register user

const registerUser = async (req,res)=>{
        const {name,password,email} = req.body;
        try {
            // check if user already registered
            const exists = await userModel.findOne({email});
            if(exists){
                return res.json({success: false, message:"user already exists"})
            }

            // validate email
            if(!validator.isEmail(email)){
                return res.json({success: false, message:"Invalid email"})
            }

            if(password.length<8){
                return res.json({success: false, message:"Password should be at least 8 characters long"})
            }

            // hashing user password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt);

            // create new user
            const newUser = new userModel({name:name,
                email:email,
                password:hashedPassword})
            const user = await newUser.save();
            const token = createToken(user._id)
            res.json({success: true, message:"User registered successfully",token})

        } catch (error) {
            console.log(error);
            res.status(500).json({success: false, message:"Server error"})
            
        }
}



export {loginUser, registerUser}

