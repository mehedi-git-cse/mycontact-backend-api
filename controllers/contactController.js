
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

        const newContact = {
            id: Date.now(),
            name,
            email,
            phone,
        };

        res.status(201).json({
            success: true,
            message: "Contact created successfully.",
            data: newContact,
        });
    } catch (error) {
        next(error); // Pass the error to the error handler middleware
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
