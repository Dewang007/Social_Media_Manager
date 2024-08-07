import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";

const verifyJwt = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ message: "Token not found." });
    }

    // Decode token
    const decodeToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
    if (!decodeToken) {
      return res.status(401).json({ message: "Invalid token." });
    }

    // Get user
    const user = await User.findOne({ _id: decodeToken._id });
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // Store current user in request
    req.user = user;
    next();
  } catch (error) {
    console.log("Something went wrong : ", error);
    return res.status(404).json({ message: "Something went wrong." });
  }
};

export { verifyJwt };
