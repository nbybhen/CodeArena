import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("Database successfully connnected.");
        });

        connection.on("error", (err) => {
            console.log("There was a problem connecting to MongoDB. Please make sure MongoDB is running.", err);
            process.exit();
        });
    } catch (err) {
        console.log("Couldn't connect to DB", err);
    }
}
