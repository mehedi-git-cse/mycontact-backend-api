const { MongoClient } = require("mongodb");
const { mongoose } = require("mongoose");
//const { createPool } = require('mysql');
const mysql = require("mysql2/promise");
const User = require("../models/User");
const contacts = require("../models/contacts");
const asyncHandler = require("express-async-handler");

// Create a reusable connection pool
const pool = mysql.createPool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
});

/**
 * @desc Get all contacts
 * @route GET /api/contacts
 * @access Public
 */
const getAllContacts = asyncHandler(async (req, res) => {
  const getContact = await contacts.find();

  if (!getContact) {
    const error = new Error("Contact not found.");
    res.status(400);
    return next(error);
  }

  res.status(200).json({
    success: true,
    message: "Fetched all contacts successfully.",
    data: getContact,
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

    /*const user = await fetchUsers();
    if (!user) {
      const error = new Error("Data not found.");
      res.status(400);
      return next(error);
    }*/

    const contact = new contacts({
      name: name,
      email: email,
      phone: phone,
    });

    const savedcontacts = await contact.save();

    res.status(200).json({
      success: true,
      message: "Contact created successfully.",
      data: savedcontacts,
    });
  } catch (error) {
    const err = new Error(error.errorResponse.errmsg);
    res.status(400);
    next(err);
  }
});

//This is the raw query example method

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
    console.error("Database Query Error:", err);
    return false;
  }
};

/*async function fetchUsers(){
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
}*/

/**
 * @desc Get a single contact by ID
 * @route GET /api/contacts/:id
 * @access Public
 */
const getContact = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const getContactInfo = await contacts.findById(id);

    if (!getContactInfo) {
      res.status(404);
      throw new Error(`Contact with ID ${id} not found.`);
    }

    res.status(200).json({
      success: true,
      message: "Fetched contact successfully.",
      data: getContactInfo,
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
    if (!id || !name || !email || !phone) {
      res.status(400);
      throw new Error("All fields (name, email, phone) are mandatory.");
    }

    const updatedContact = {
      id,
      name,
      email,
      phone,
    };

    const updateContacts = await contacts.findByIdAndUpdate(
      id, // The ID of the document to update
      updatedContact, // The updated data
      { new: true } // Options: `new: true` returns the updated document
    );

    if (!updateContacts) {
      res.status(400);
      throw new Error("Data not Update.");
    }

    res.status(200).json({
      success: true,
      message: `Contact with ID ${id} updated successfully.`,
      data: updateContacts,
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

    const check = await contacts.findById(id);
    if (!check) {
      res.status(400);
      throw new Error("Data not exist!");
    }

    const updateContacts = await contacts.findByIdAndDelete(id);

    console.log(updateContacts);

    if (!updateContacts) {
      res.status(400);
      throw new Error("Data Not deleted!");
    }

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
