const mongoose = require('mongoose');
const GroupCode = require('./model/groupcode');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleGroupCodes = [
  { name: 'Cotton Collection' },
  { name: 'Silk Premium' },
  { name: 'Linen Natural' },
  { name: 'Wool Winter' },
  { name: 'Synthetic Blend' },
  { name: 'Denim Classic' },
  { name: 'Velvet Luxury' },
  { name: 'Jersey Comfort' },
];

async function seedGroupCodes() {
  try {
    // Clear existing data
    await GroupCode.deleteMany({});
    console.log('Cleared existing group codes');

    // Insert sample data
    const result = await GroupCode.insertMany(sampleGroupCodes);
    console.log(`Successfully added ${result.length} group codes:`);
    result.forEach(code => console.log(`- ${code.name}`));

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding group codes:', error);
    mongoose.connection.close();
  }
}

seedGroupCodes(); 