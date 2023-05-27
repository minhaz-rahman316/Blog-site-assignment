const Users = require("../models/User");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User registration
exports.register = async (req, res) => {
  const { username, phone, email, password, role } = req.body;

  try {
    await checkExistingUser(username, "username");
    await checkExistingUser(email, "email");

    const hashPassword = await bcrypt.hash(password, 5);

    const user = new Users({
      username,
      password: hashPassword,
      // profile_pic: profile_pic || "",
      phone,
      email,
      role,
    });

    const result = await user.save();

    return res.status(201).send({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error });
  }
};

// Check if a user already exists
const checkExistingUser = (value, field) => {
  return new Promise((resolve, reject) => {
    const query = {};
    query[field] = value;

    Users.findOne(query, (error, data) => {
      if (error) return reject(error);

      if (data) {
        const errorMessage = `Please enter a unique ${field} or User already exists`;
        return reject({ data: errorMessage });
      }

      return resolve();
    });
  });
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await Users.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "6d" }
    );

    return res.status(200).send({
      success: true,
      message: "Login successful!",
      email: user.email,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal server error" });
  }
};

// Update user profile
exports.update = (req, res) => {
  const id = req.params.id;
  const query = { _id: id };
  const reqBody = req.body;
  Users.updateOne(query, reqBody, (error, data) => {
    if (error) {
      res
        .status(400)
        .json({ message: "User profile update failed", error: error });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: data,
      });
    }
  });
};

// User logout
exports.logout = async (req, res) => {
  console.log(`Before Logout: ${req.headers.token}`);
  try {
    delete req.headers["token"];
    console.log(`After Logout: ${req.headers.token}`);
    res.status(200).send({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
};
