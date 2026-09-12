import ParkingSlot from "../models/ParkingSlot.js";

export async function getSlots(req, res) {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.type) filter.type = req.query.type;

  const slots = await ParkingSlot.find(filter).sort({ slotNumber: 1 });
  console.log("Jumlah slot ditemukan:", slots.length);
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

export async function seedSlots(req, res) {
  const slots = [];
  for (let i = 1; i <= 20; i++) {
    slots.push({
      slotNumber: `A${String(i).padStart(2, "0")}`,
      type: i <= 15 ? "car" : "motorcycle",
      status: "available"
    });
  }

  let created = 0;
  for (const slot of slots) {
    const result = await ParkingSlot.updateOne(
      { slotNumber: slot.slotNumber },
      { $setOnInsert: slot },
      { upsert: true }
    );
    if (result.upsertedCount) created++;
  }

  const total = await ParkingSlot.countDocuments();
  res.json({ message: "Seed selesai", slotsBaruDitambahkan: created, totalSlotSekarang: total });
}