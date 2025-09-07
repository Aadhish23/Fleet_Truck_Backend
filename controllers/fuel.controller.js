// BACKEND/controllers/fuel.controller.js
const FuelLog = require('../models/FuelLog');

// Add new fuel log
exports.addFuelLog = async (req, res) => {
  try {
    const { truckId, fuelAmount, fuelLevelPercentage, date } = req.body;

    // Validate input
    if (!truckId || !fuelAmount || fuelLevelPercentage == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new fuel log
    const newLog = await FuelLog.create({
      truckId,
      fuelAmount,
      fuelLevelPercentage,
      date: date ? new Date(date) : new Date() // Use provided date or default to now
    });

    res.status(201).json(newLog);
  } catch (err) {
    console.error("❌ Error adding fuel log:", err);
    res.status(500).json({ message: "Server error while adding fuel log" });
  }
};

// Get weekly consumption and fleet levels
exports.getFuelSummary = async (req, res) => {
  try {
    const today = new Date();

    // Start of the current week (Sunday 00:00 UTC)
    const startOfWeek = new Date(today);
    startOfWeek.setUTCHours(0, 0, 0, 0);
    startOfWeek.setUTCDate(today.getUTCDate() - today.getUTCDay());

    console.log("📅 Start of week:", startOfWeek);

    // Weekly consumption grouped by truck and day of the week
    const weeklyConsumption = await FuelLog.aggregate([
      {
        $match: {
          date: { $gte: startOfWeek } // Last 7 days
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfWeek: "$date" }, // 1 = Sunday, 7 = Saturday
            truckId: "$truckId"          // Group by truck
          },
          totalFuel: { $sum: "$fuelAmount" }
        }
      },
      { $sort: { "_id.day": 1 } }
    ]);

    // Fleet fuel levels summary
    const fleetLevels = await FuelLog.aggregate([
      {
        $group: {
          _id: null,
          good: {
            $sum: { $cond: [{ $gte: ["$fuelLevelPercentage", 80] }, 1, 0] }
          },
          medium: {
            $sum: {
              $cond: [
                { $and: [{ $gte: ["$fuelLevelPercentage", 50] }, { $lt: ["$fuelLevelPercentage", 80] }] },
                1,
                0
              ]
            }
          },
          low: {
            $sum: { $cond: [{ $lt: ["$fuelLevelPercentage", 50] }, 1, 0] }
          },
          total: { $sum: 1 }
        }
      }
    ]);

    res.json({
      weeklyConsumption,
      fleetLevels: fleetLevels[0] || { good: 0, medium: 0, low: 0, total: 0 }
    });
  } catch (err) {
    console.error("❌ Error fetching summary:", err);
    res.status(500).json({ message: "Server error fetching summary" });
  }
};
