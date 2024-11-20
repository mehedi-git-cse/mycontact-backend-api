const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  loginUser,
} = require("../controllers/userController");

const  validateToken = require("../middleware/validateTokenhandler");

router.route("/").get(validateToken, getAllUsers);
router.route("/register").post(createUser);
router.route("/login").post(loginUser);

router.route("/:id(\\d+)").get(getUser).put(updateUser);

module.exports = router;