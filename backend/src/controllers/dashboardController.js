import ParkingSlot from "../models/ParkingSlot.js";
import ParkingTransaction from "../models/ParkingTransaction.js";

export async function statistics(req, res) {
  const [totalSlots, availableSlots, occupiedSlots, maintenanceSlots, activeParking, completedToday] =
    await Promise.all([
      ParkingSlot.countDocuments(),
      ParkingSlot.countDocuments({ status: "available" }),
      ParkingSlot.countDocuments({ status: "occupied" }),
      ParkingSlot.countDocuments({ status: "maintenance" }),
      ParkingTransaction.countDocuments({ status: "active" }),
      ParkingTransaction.find({
        status: "completed",
        exitTime: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      })
    ]);

  const todayRevenue = completedToday.reduce((sum, item) => sum + item.amount, 0);

  res.json({
    totalSlots,
    availableSlots,
    occupiedSlots,
    maintenanceSlots,
    activeParking,
    todayTransactions: completedToday.length,
    todayRevenue
  });
}
