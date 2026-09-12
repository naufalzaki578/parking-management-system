import dotenv from "dotenv";
dotenv.config({ path: ".env.production.local", override: true });

// Buang tanda kutip di awal/akhir jika ada yang ikut terbawa
if (process.env.MONGODB_URI) {
  process.env.MONGODB_URI = process.env.MONGODB_URI.trim().replace(/^["']|["']$/g, "");
}

const mongoose = (await import("mongoose")).default;
const connectDB = (await import("./src/config/database.js")).default;
const ParkingSlot = (await import("./src/models/ParkingSlot.js")).default;

console.log("URI valid?", /^mongodb(\+srv)?:\/\//.test(process.env.MONGODB_URI || ""));

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

console.log("Sample parking slots created (production).");
await mongoose.disconnect();