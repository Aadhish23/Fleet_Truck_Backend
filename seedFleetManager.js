// seedFleetManager.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FleetManager = require('./models/FleetManager');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seed() {
  const email = 'aa@gmail.com';
  const password = '1234';

  // Remove existing user with same email
  await FleetManager.deleteOne({ email });

  // Create new FleetManager
  const manager = new FleetManager({ email, password });
  await manager.save();
  console.log('✅ Seeded FleetManager:', email);
  mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Error seeding FleetManager:', err);
  mongoose.disconnect();
});
