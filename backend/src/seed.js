import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/database.js";
import ParkingSlot from "./models/ParkingSlot.js";

await connectDB();

const slots = [];
for (let i = 1; i <= 20; i++) {
  slots.push({
    slotNumber: `A${String(i).padStart(2, "0")}`,
    type: i <= 15 ? "car" : "motorcycle",
    status: "available"
  });
}

for (const slot of slots) {
  await ParkingSlot.updateOne(
    { slotNumber: slot.slotNumber },
    { $setOnInsert: slot },
    { upsert: true }
  );
}

console.log("Sample parking slots created.");
await mongoose.disconnect();
