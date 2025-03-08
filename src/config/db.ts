import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";

const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('DB connected');

    } catch (error) {
        console.log('DB connect failed', error);
        process.exit(1);
    }
}

export default connectToDatabase;