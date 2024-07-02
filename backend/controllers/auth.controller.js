import {User} from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';
import express from 'express';

export const signup = async (req,res)=> { //signup auth
    try {
        const {fullName, username, email, password} = req.body; //destructure req.body
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //regex for email validation
        if (!emailRegex.test(email)) { //check if email is valid
            return res.status(400).json({message: "Invalid email format"}); //return error if email is invalid
        }

        const existingUser = await User.findOne({username}); //check if username already exists
        if(existingUser){ //if username exists, return error
            return res.status(400).json({message: "Username already exists"});
        }
        const existingEmail = await User.findOne({email}); //check if email already exists
        if(existingEmail){ //if email exists, return error
            return res.status(400).json({message: "Email already exists"});
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }

        // hash password

        const salt = await bcrypt.genSalt(10); //generate salt (encrypting password)
        const hashedPassword = await bcrypt.hash(password, salt); //hash password with salt

        const newUser = new User({
            fullName:fullName,
            username:username,
            email:email,
            password:hashedPassword,
        })

        if(newUser){
            generateTokenAndSetCookie(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                coverImg: newUser.profileImg,
                profileImg: newUser.profileImg,
            })
        } else{
            res.status(400).json({message: "Invalid user data"});
        }
    } catch (error) {
        console.log("Error in signup", error);
    }
};


export const login = async (req,res)=> {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        console.log(username, password, user);
        const isPasswordValid = await bcrypt.compare(password, user?.password || ""); //compare given password with hashed password


        if(!user || !isPasswordValid){
            return res.status(400).json({message: "Invalid username or password"});
        }
        generateTokenAndSetCookie(user._id,res); // generate token and set cookie
        res.status(200).json({ //return user data in json format
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            coverImg: user.coverImg,
            profileImg: user.profileImg,
        })
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};


export const logout = async (req,res)=> {
    try{
        res.cookie("jwt","",{maxAge:0}) //clear cookie
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
    };

export const getMe = async (req,res)=> {
    try{
        const user = await User.findById(req.user._id).select("-password"); //find user by id from req.userId   
        res.status(200).json(user); //return user data
    } catch (error){
        console.log("Error in getMe controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }};