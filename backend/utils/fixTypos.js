const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI;

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    const db = mongoose.connection.db;
    const hotelsCollection = db.collection("hotels");

    // 1. Fix "Palm Groov" name
    const updateNameResult = await hotelsCollection.updateMany(
      { name: "Palm Groov" },
      { $set: { name: "Palm Groove" } }
    );
    console.log(`Updated hotel names (Palm Groov -> Palm Groove): ${updateNameResult.modifiedCount}`);

    // 2. Fix descriptions containing typos
    // a. "This hotel is grate and has aal the facilities" -> "This hotel is great and has all the facilities"
    const updateDesc1Result = await hotelsCollection.updateMany(
      { description: "This hotel is grate and has aal the facilities" },
      { $set: { description: "This hotel is great and has all the facilities" } }
    );
    console.log(`Updated descriptions (grate & aal -> great & all): ${updateDesc1Result.modifiedCount}`);

    // b. "We provide all kinds of services from basic to advance" -> "We provide all kinds of services from basic to advanced"
    const updateDesc2Result = await hotelsCollection.updateMany(
      { description: "We provide all kinds of services from basic to advance" },
      { $set: { description: "We provide all kinds of services from basic to advanced" } }
    );
    console.log(`Updated descriptions (advance -> advanced): ${updateDesc2Result.modifiedCount}`);

    console.log("All typos successfully corrected!");
    process.exit(0);
  } catch (error) {
    console.error("Error correcting typos:", error);
    process.exit(1);
  }
}

run();
