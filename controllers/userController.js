const { mongoose } = require('mongoose');
const User = require('../models/User');

const asyncHandler = require("express-async-handler");

/**
 * @desc Get all users
 * @route GET /api/user
 * @access Public
 */
const getAllUsers = asyncHandler(async (req, res) => {

    const userInfo = await User.findAll();
    if(!userInfo){
        const error = new Error("No user find!!");
        res.status(400); 
        return next(error);
    }

    res.status(200).json({
        success: true,
        message: "Fetched all User successfully.",
        data: userInfo,
    });
});

/**
 * @desc Create a new user
 * @route POST /api/user
 * @access Public
 */
const createUser = asyncHandler(async (req, res, next) => {
    try {
        const { name, email, phone,status,mongo_id, image } = req.body;

        // Validate required fields
        if (!name || !email || !phone ) {
            const error = new Error("All fields (name, email, phone) are mandatory.");
            res.status(400); 
            return next(error);
        }

        const user = new User({
            name: name,
            email: email,
            phone: phone,
            status:status,
            mongo_id:mongo_id,
            image:image
        });

        const savedUser = await user.save();

        if(!savedUser){
            const error = new Error("Sorry user not created.");
            res.status(400); 
            return next(error);
        }

        res.status(201).json({
            success: true,
            message: "User created successfully.",
            data: savedUser,
        });

    } catch (error) {
        const err = new Error(error.errorResponse.errmsg);
        res.status(400); 
        next(err);
    }
});

const getUser = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const userInfo = await User.findAll({
        where: {
            id: id
        },
    });
    
  
    if(!userInfo){
        const error = new Error("No user find!!");
        res.status(400); 
        return next(error);
    }

    res.status(200).json({
        success: true,
        message: "Fetched all User successfully.",
        data: userInfo,
    });
});

const updateUser = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { name, email, phone } = req.body;

    if (!id || !name || !email || !phone) {
        res.status(400);
        throw new Error("All fields (name, email, phone) are mandatory.");
    }
    const updatedRows = await User.update(
        req.body,
        {
            where: { id: id },
        }
    );
    
    if (updatedRows[0] === 0) {
        return res.status(404).json({
            success: false,
            message: "User not found or no changes made.",
        });
    }
    
    res.status(200).json({
        success: true,
        message: "Updated User successfully.",
        data: '',
    });
});

module.exports = {
    getAllUsers,
    createUser,
    getUser,
    updateUser
};
