import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";

const createUser = async (req, res) => {
  try {
    // Get data from body
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check email is already exist or not
    const isEmail = await User.findOne({ email: email });
    if (isEmail) {
      return res.status(400).json({ message: "This user is already exist." });
    }

    // password encryption
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    if (!hashedPassword) {
      return res.status(400).json({ message: "Password hashing failed." });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    if (!user) {
      res.status(400).json({ message: "Something went wrong to create user." });
    }

    // Store in database
    await user.save();

    // Response
    return res
      .status(202)
      .json({ message: "User created successfully.", user });
  } catch (error) {
    console.log("Something went wrong : ", error);
    return res.status(404).json({ message: "Something went wrong." });
  }
};

const login = async (req, res) => {
  try {
    // Get data from body
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({ message: "All fields are required." });
    }

    // check this user exist or not
    const isUser = await User.findOne({ email: email });
    if (!isUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare password
    const comparePassword = bcrypt.compareSync(password, isUser.password);
    if (!comparePassword) {
      return res.status(404).json({ message: "Invalid password." });
    }

    // Create access and refresh token
    const accessToken = jwt.sign(
      {
        _id: isUser._id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
    const refreshToken = jwt.sign(
      {
        _id: isUser._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
    if (!accessToken) {
      return res
        .status(404)
        .json({ message: "Something went wrong to create access token." });
    }
    if (!refreshToken) {
      return res
        .status(404)
        .json({ message: "Something went wrong to create refresh token." });
    }

    // Also save refresh token in database
    isUser.refreshToken = refreshToken;
    await isUser.save({ validateBeforeSave: false });

    // Store access and refresh token inside cookie
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(202)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ message: "User logged in successfully." });
  } catch (error) {
    console.log("Something went wrong : ", error);
    return res.status(404).json({ message: "Something went wrong." });
  }
};

const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: { refreshToken: undefined },
      },
      { new: true }
    );

    // Clear cookie
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(202)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "user logout successfully." });
  } catch (error) {
    console.log("Something went wrong : ", error);
    return res.status(404).json({ message: "Something went wrong." });
  }
};

export { createUser, login, logout };
