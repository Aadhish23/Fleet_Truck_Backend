const mongoose = require('mongoose');

const FuelLogSchema = new mongoose.Schema({
  truckId: {
    type: String,
    ref: 'Truck', // assuming you have a Truck model
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  fuelAmount: {
    type: Number, // liters or gallons
    required: true,
  },
  fuelLevelPercentage: {
    type: Number, // 0-100
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('FuelLog', FuelLogSchema);
