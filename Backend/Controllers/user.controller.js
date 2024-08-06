import bcrypt from "bcrypt";
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

export { createUser };
