import ParkingSlot from "../models/ParkingSlot.js";

export async function getSlots(req, res) {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.type) filter.type = req.query.type;

  const slots = await ParkingSlot.find(filter).sort({ slotNumber: 1 });
  res.json(slots);
}

export async function createSlot(req, res) {
  const { slotNumber, type = "car", status = "available" } = req.body;

  if (!slotNumber) return res.status(400).json({ message: "slotNumber is required" });

  const exists = await ParkingSlot.findOne({ slotNumber: slotNumber.toUpperCase() });
  if (exists) return res.status(409).json({ message: "Slot already exists" });

  const slot = await ParkingSlot.create({
    slotNumber,
    type,
    status
  });

  res.status(201).json(slot);
}

export async function updateSlot(req, res) {
  const slot = await ParkingSlot.findById(req.params.id);
  if (!slot) return res.status(404).json({ message: "Slot not found" });

  if (slot.status === "occupied" && req.body.status === "available") {
    return res.status(400).json({ message: "Cannot free an occupied slot manually" });
  }

  Object.assign(slot, req.body);
  await slot.save();
  res.json(slot);
}

export async function deleteSlot(req, res) {
  const slot = await ParkingSlot.findById(req.params.id);
  if (!slot) return res.status(404).json({ message: "Slot not found" });

  if (slot.status === "occupied") {
    return res.status(400).json({ message: "Cannot delete an occupied slot" });
  }

  await slot.deleteOne();
  res.json({ message: "Slot deleted" });
}
