import {connect} from "mongoose";

const connectDB = async () => {
  try {
    await connect(process.env.DB_URI);
    console.log("Database is Running");
  } catch (error) {
    console.error("DB error:", error);
    process.exit(1);
  }
};

export default connectDB;
