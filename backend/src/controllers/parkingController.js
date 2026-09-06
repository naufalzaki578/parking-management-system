import ParkingSlot from "../models/ParkingSlot.js";
import ParkingTransaction from "../models/ParkingTransaction.js";
import { calculateFee } from "../config/parking.js";

export async function vehicleEntry(req, res) {
  const { vehicleNumber, vehicleType = "car", slotId } = req.body;

  if (!vehicleNumber || !slotId) {
    return res.status(400).json({ message: "vehicleNumber and slotId are required" });
  }

  const normalizedPlate = vehicleNumber.toUpperCase().trim();

  const activeVehicle = await ParkingTransaction.findOne({
    vehicleNumber: normalizedPlate,
    status: "active"
  });

  if (activeVehicle) {
    return res.status(409).json({ message: "Vehicle is already parked" });
  }

  const slot = await ParkingSlot.findById(slotId);
  if (!slot) return res.status(404).json({ message: "Slot not found" });

  if (slot.status !== "available") {
    return res.status(400).json({ message: "Selected slot is not available" });
  }

  if (slot.type !== vehicleType) {
    return res.status(400).json({ message: `Slot ${slot.slotNumber} is for ${slot.type}` });
  }

  const transaction = await ParkingTransaction.create({
    vehicleNumber: normalizedPlate,
    vehicleType,
    slot: slot._id,
    entryTime: new Date(),
    createdBy: req.user.id
  });

  slot.status = "occupied";
  await slot.save();

  const populated = await transaction.populate("slot", "slotNumber type");
  res.status(201).json(populated);
}

export async function vehicleExit(req, res) {
  const { vehicleNumber } = req.body;

  if (!vehicleNumber) {
    return res.status(400).json({ message: "vehicleNumber is required" });
  }

  const transaction = await ParkingTransaction.findOne({
    vehicleNumber: vehicleNumber.toUpperCase().trim(),
    status: "active"
  }).populate("slot");

  if (!transaction) {
    return res.status(404).json({ message: "Active parking transaction not found" });
  }

  const exitTime = new Date();
  const durationMinutes = Math.max(
    1,
    Math.ceil((exitTime - transaction.entryTime) / 60000)
  );
  const amount = calculateFee(transaction.entryTime, exitTime);

  transaction.exitTime = exitTime;
  transaction.durationMinutes = durationMinutes;
  transaction.amount = amount;
  transaction.status = "completed";
  await transaction.save();

  if (transaction.slot) {
    transaction.slot.status = "available";
    await transaction.slot.save();
  }

  res.json(transaction);
}

export async function activeParking(req, res) {
  const data = await ParkingTransaction.find({ status: "active" })
    .populate("slot", "slotNumber type")
    .sort({ entryTime: -1 });

  res.json(data);
}

export async function history(req, res) {
  const { search, status } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { vehicleNumber: { $regex: search, $options: "i" } }
    ];
  }

  const data = await ParkingTransaction.find(filter)
    .populate("slot", "slotNumber type")
    .sort({ createdAt: -1 })
    .limit(200);

  res.json(data);
}
