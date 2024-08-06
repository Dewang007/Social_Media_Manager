import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    if (connection) {
      console.log("Database connected successfully!!!");
    } else {
      console.log("Database connection failed.");
    }
  } catch (error) {
    console.log("Something went wrong to connect database : ", error);
  }
};

export default dbConnection;
