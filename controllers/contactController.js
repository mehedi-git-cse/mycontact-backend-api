const { MongoClient } = require('mongodb');
const { mongoose } = require('mongoose');
//const { createPool } = require('mysql');
const mysql = require('mysql2/promise');
const User = require('../models/User');
const contacts = require('../models/contacts');

// Create a reusable connection pool
const pool = mysql.createPool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
});

const asyncHandler = require("express-async-handler");
/**
 * @desc Get all contacts
 * @route GET /api/contacts
 * @access Public
 */
const getAllContacts = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Fetched all contacts successfully.",
        data: [], // Replace with actual data from database
    });
});

/**
 * @desc Create a new contact
 * @route POST /api/contacts
 * @access Public
 */
const createContact = asyncHandler(async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;

        // Validate required fields
        if (!name || !email || !phone) {
            const error = new Error("All fields (name, email, phone) are mandatory.");
            res.status(400); 
            return next(error);
        }

        const user = await fetchUsers();
        if(!user){
            const error = new Error("Data not found.");
            res.status(400); 
            return next(error);
        }

        const connection = await connectToMongoDB();

        if(!connection){
            const error = new Error("Database Connection Failed!");
            res.status(400); 
            return next(error);
        }

        const contact = new contacts({
            name: name,
            email: email,
            phone: phone
        });

        const savedcontacts = await contact.save();

        res.status(200).json({
            success: true,
            message: "Contact created successfully.",
            data: savedcontacts,user,
        });

    } catch (error) {
        const err = new Error(error.errorResponse.errmsg);
        res.status(400); 
        next(err);
    }
});


//this is the raw query example method

/*const fetchUsers = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        console.log(rows)
        return rows;
    } catch (err) {
        console.error('Database Query Error:', err);
        return false;
    }
};*/

const fetchUsers = async () => {
    try {
        const users = await User.findAll({
            where: {
                status: 1,
                is_archived: 0,
            },
        });
        return users;
    } catch (err) {
        console.error('Database Query Error:', err);
        return false;
    }
};

const connectToMongoDB = asyncHandler(async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI + '/' + process.env.DB_NAME;
        await mongoose.connect(MONGO_URI);
        return true;
        console.log('Connected to MongoDB!');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        return false;
    }
});

/**
 * @desc Get a single contact by ID
 * @route GET /api/contacts/:id
 * @access Public
 */
const getContact = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;

        // Simulate fetching contact by ID (replace with DB logic)
        const contact = {
            id, // Replace with actual contact data
            name: "John Doe",
            email: "johndoe@example.com",
            phone: "123-456-7890",
        };

        if (!contact) {
            res.status(404);
            throw new Error(`Contact with ID ${id} not found.`);
        }

        res.status(200).json({
            success: true,
            message: "Fetched contact successfully.",
            data: contact,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @desc Update a contact by ID
 * @route PUT /api/contacts/:id
 * @access Public
 */
const updateContact = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;

        // Validate required fields
        if (!name || !email || !phone) {
            res.status(400);
            throw new Error("All fields (name, email, phone) are mandatory.");
        }

        // Simulate contact update (replace with DB logic)
        const updatedContact = {
            id,
            name,
            email,
            phone,
        };

        res.status(200).json({
            success: true,
            message: `Contact with ID ${id} updated successfully.`,
            data: updatedContact,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * @desc Delete a contact by ID
 * @route DELETE /api/contacts/:id
 * @access Public
 */
const deleteContact = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;

        // Simulate contact deletion (replace with DB logic)
        res.status(200).json({
            success: true,
            message: `Contact with ID ${id} deleted successfully.`,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = {
    getAllContacts,
    createContact,
    getContact,
    updateContact,
    deleteContact,
};
