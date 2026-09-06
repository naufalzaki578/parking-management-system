import mongoose from "mongoose";

const parkingSlotSchema = new mongoose.Schema(
  {
    slotNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["car", "motorcycle"], default: "car" },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available"
    }
  },
  { timestamps: true }
);

export default mongoose.model("ParkingSlot", parkingSlotSchema);
