const express = require("express");
const router = express.Router();

const validateToken = require("../middleware/validateTokenhandler");
const {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  loginUser,
} = require("../controllers/userController");

// Public routes (no middleware)
router.route("/register").post(createUser);
router.route("/login").post(loginUser);

// Apply middleware to all subsequent routes
router.use(validateToken);

// Protected routes
router.route("/").get(getAllUsers);
router.route("/:id(\\d+)").get(getUser).put(updateUser);

module.exports = router;