import mongoose from "mongoose";

const parkingTransactionSchema = new mongoose.Schema(
  {
    vehicleNumber: { type: String, required: true, uppercase: true, trim: true },
    vehicleType: { type: String, enum: ["car", "motorcycle"], required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: "ParkingSlot", required: true },
    entryTime: { type: Date, required: true },
    exitTime: { type: Date, default: null },
    durationMinutes: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "completed"], default: "active" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("ParkingTransaction", parkingTransactionSchema);
