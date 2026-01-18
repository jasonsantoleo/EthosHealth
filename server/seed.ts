import { connectDB, HealthSchemeModel } from './database';

const sampleSchemes = [
  {
    name: 'Diabetes Care Plus',
    description: 'Comprehensive diabetes management program designed for Type 2 diabetes patients. Includes specialized care, regular monitoring, medication coverage, and dietary consultation.',
    coverage: 5000,
    processingTime: '2-3 days',
    networkHospitals: 500,
    matchPercentage: 95,
    type: 'diabetes-care',
  },
  {
    name: 'General Health Shield',
    description: 'Basic health insurance covering routine checkups, emergency care, preventive treatments, and essential medical procedures with nationwide coverage.',
    coverage: 3000,
    processingTime: '1-2 days',
    networkHospitals: 800,
    matchPercentage: 87,
    type: 'general-health',
  },
  {
    name: 'Family Care Package',
    description: 'Extended family health coverage including spouse and dependents under one comprehensive plan with shared benefits and family-oriented services.',
    coverage: 8000,
    processingTime: '3-5 days',
    networkHospitals: 600,
    matchPercentage: 78,
    type: 'family-care',
  },
  {
    name: 'Emergency Care Plus',
    description: 'Specialized emergency care coverage with 24/7 support, ambulance services, critical care coverage, and immediate medical attention.',
    coverage: 10000,
    processingTime: 'Immediate',
    networkHospitals: 1200,
    matchPercentage: 92,
    type: 'emergency-care',
  },
];

async function seedDatabase() {
  try {
    await connectDB();
    
    // Clear existing schemes
    await HealthSchemeModel.deleteMany({});
    console.log('✅ Cleared existing schemes');
    
    // Insert sample schemes
    const insertedSchemes = await HealthSchemeModel.insertMany(sampleSchemes);
    console.log(`✅ Inserted ${insertedSchemes.length} health schemes`);
    
    console.log('✅ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
