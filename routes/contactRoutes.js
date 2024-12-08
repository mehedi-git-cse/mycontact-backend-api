const express = require("express");
const validateToken = require("../middleware/validateTokenhandler");
const router = express.Router();

// Importing contact controller methods
const {
  getAllContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

router.use(validateToken);
// Routes
router.route("/").get(getAllContacts).post(createContact);

router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

// Export the router
module.exports = router;
