const { mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const MongoUser = require("../models/MongoUser");

const asyncHandler = require("express-async-handler");

/**
 * @desc Get all users
 * @route GET /api/user
 * @access Public
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const userInfo = await MongoUser.find();
  if (!userInfo) {
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
    const { name, email, phone, status, mongo_id, image, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      const error = new Error("All fields (name, email, phone) are mandatory.");
      res.status(400);
      return next(error);
    }

    const userAvailable = await User.findAll({
      where: {
        email: email,
      },
    });

    if (userAvailable.length > 0) {
      console.log("empty");
      const error = new Error("User Already register.");
      res.status(400);
      return next(error);
    }

    // Hash Password
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: name,
      email: email,
      password: hashPassword,
      phone: phone,
      status: status,
      mongo_id: mongo_id,
      image: image,
    });

    const savedUser = await user.save();

    if (!savedUser) {
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

const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("All fields ( email, phone) are mandatory.");
      res.status(400);
      return next(error);
    }

    const userAvailable = await User.findOne({
      where: {
        email: email,
      },
    });

    if (userAvailable.length < 1) {
      const error = new Error("User Not Found.");
      res.status(400);
      return next(error);
    }

    // Hash Password
    if (userAvailable && await bcrypt.compare(password, userAvailable.password)) {

      const accessToken = await jwt.sign({
        user: {
          name: userAvailable.name,
          email: userAvailable.email,
          id: userAvailable.id
        },
      },
        process.env.ACCESS_TOKEN_SECERT,
        { expiresIn: "30m" }
      );

      res.status(201).json({
        success: true,
        message: "User Login successfully.",
        user_login_token: accessToken,
      });

    } else {
      const error = new Error("Email or Passwoprd not valid.");
      res.status(401);
      return next(error);
    }

  } catch (error) {
    const err = new Error(error.errorResponse.errmsg);
    res.status(400);
    next(err);
  }
});

const getUser = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const userInfo = await User.findAll({
      where: {
        id: id,
      },
    });

    if (!userInfo || userInfo.length === 0 || userInfo === "") {
      const error = new Error("User not found.");
      res.status(400);
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Fetched User successfully.",
      data: userInfo,
    });
  } catch (error) {
    const err = new Error(error.errorResponse.errmsg);
    res.status(400);
    next(err);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  if (!id || !name || !email || !phone) {
    res.status(400);
    throw new Error("All fields (name, email, phone) are mandatory.");
  }
  const updatedRows = await User.update(req.body, {
    where: { id: id },
  });

  if (updatedRows[0] === 0) {
    return res.status(404).json({
      success: false,
      message: "User not found or no changes made.",
    });
  }

  res.status(200).json({
    success: true,
    message: "Updated User successfully.",
    data: "",
  });
});

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  loginUser,
};
