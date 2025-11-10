<<<<<<< HEAD
import { connectDB } from "../../../lib/mongodb";
=======
import { connectDB } from '@/lib/db/mongodb';
>>>>>>> origin/elyess
import mongoose from "mongoose";

// Define a test schema (optional)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

// Prevent model overwrite during hot reload
const User = mongoose.models.User || mongoose.model("User", userSchema);

export async function POST() {
  try {
    console.log("Connecting to DB...");
    await connectDB();

    // Insert a test document (MongoDB will create the DB + collection)
    const user = await User.create({ name: "Elyess", email: "elyess@example.com" });

    return new Response(JSON.stringify({ message: "User added!", user }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Database error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

