import express from "express";
import dotenv from "dotenv";
import dbConnection from "./Database/connection.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Database connection
dbConnection();

// Middleware
app.use(express.json());

// All Routes
import userRoute from "./Routes/user.route.js";

app.use("/api/user", userRoute);

// Listening app
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
