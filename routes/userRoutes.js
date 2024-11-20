const express = require("express");
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
} = require("../controllers/userController");

router.route("/").get(getAllUsers);
router.route("/register").post(createUser);

router.route("/:id(\\d+)").get(getUser).put(updateUser);

module.exports = router;