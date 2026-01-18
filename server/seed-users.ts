import { connectDB } from './database.js';
import { User } from './models/User.js';

const southIndianUsers = [
  {
    abha_id: '23456789101234',
    name: 'Priya Venkatesh',
    dateOfBirth: '1990-03-15',
    address: '123 MG Road, Bangalore, Karnataka - 560001',
    bloodGroup: 'O+',
    gender: 'Female',
    medicalConditions: 'Diabetes Type 2, Hypertension',
    emergencyContact: '+91-98765-43210',
    wallet_balance: 1500,
    coinbase_wallet_address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    transactions: []
  },
  {
    abha_id: '34567890123456',
    name: 'Rajesh Kumar',
    dateOfBirth: '1985-07-22',
    address: '456 Anna Salai, Chennai, Tamil Nadu - 600002',
    bloodGroup: 'B+',
    gender: 'Male',
    medicalConditions: 'Asthma, Allergies',
    emergencyContact: '+91-98765-43211',
    wallet_balance: 2300,
    coinbase_wallet_address: '0x8a4b3c2d1e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
    transactions: []
  },
  {
    abha_id: '45678901234567',
    name: 'Lakshmi Narayanan',
    dateOfBirth: '1992-11-08',
    address: '789 Brigade Road, Coimbatore, Tamil Nadu - 641001',
    bloodGroup: 'A+',
    gender: 'Female',
    medicalConditions: 'General Health',
    emergencyContact: '+91-98765-43212',
    wallet_balance: 1800,
    coinbase_wallet_address: '0x9b5c4d3e2f1a6b7c8d9e0f1a2b3c4d5e6f7a8b9c',
    transactions: []
  },
  {
    abha_id: '56789012345678',
    name: 'Arjun Reddy',
    dateOfBirth: '1988-05-20',
    address: '321 Park Street, Hyderabad, Telangana - 500001',
    bloodGroup: 'AB+',
    gender: 'Male',
    medicalConditions: 'Heart Disease, High Cholesterol',
    emergencyContact: '+91-98765-43213',
    wallet_balance: 2750,
    coinbase_wallet_address: '0xac6d5e4f3g2a7b8c9d0e1f2a3b4c5d6e7f8a9b0c',
    transactions: []
  },
  {
    abha_id: '67890123456789',
    name: 'Meera Iyer',
    dateOfBirth: '1995-09-12',
    address: '654 MG Road, Mysore, Karnataka - 570001',
    bloodGroup: 'O-',
    gender: 'Female',
    medicalConditions: 'Diabetes Type 1',
    emergencyContact: '+91-98765-43214',
    wallet_balance: 1200,
    coinbase_wallet_address: '0xbd7e6f5g4h3a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
    transactions: []
  },
  {
    abha_id: '78901234567890',
    name: 'Karthik Subramanian',
    dateOfBirth: '1983-12-25',
    address: '987 Commercial Street, Trichy, Tamil Nadu - 620001',
    bloodGroup: 'B-',
    gender: 'Male',
    medicalConditions: 'Family Planning, General Health',
    emergencyContact: '+91-98765-43215',
    wallet_balance: 3200,
    coinbase_wallet_address: '0xce8f9g6h5i4a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
    transactions: []
  },
  {
    abha_id: '89012345678901',
    name: 'Divya Menon',
    dateOfBirth: '1991-04-18',
    address: '147 MG Road, Kochi, Kerala - 682001',
    bloodGroup: 'A-',
    gender: 'Female',
    medicalConditions: 'Emergency Care Needs, Chronic Back Pain',
    emergencyContact: '+91-98765-43216',
    wallet_balance: 1650,
    coinbase_wallet_address: '0xdf9g0h7i6j5a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
    transactions: []
  },
  {
    abha_id: '90123456789012',
    name: 'Suresh Nair',
    dateOfBirth: '1987-08-30',
    address: '258 Nehru Road, Thiruvananthapuram, Kerala - 695001',
    bloodGroup: 'O+',
    gender: 'Male',
    medicalConditions: 'Hypertension, General Health',
    emergencyContact: '+91-98765-43217',
    wallet_balance: 2100,
    coinbase_wallet_address: '0xeg1h2i8j7k6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c',
    transactions: []
  },
  {
    abha_id: '01234567890123',
    name: 'Ananya Krishnan',
    dateOfBirth: '1993-01-05',
    address: '369 Brigade Road, Madurai, Tamil Nadu - 625001',
    bloodGroup: 'AB-',
    gender: 'Female',
    medicalConditions: 'Diabetes Type 2',
    emergencyContact: '+91-98765-43218',
    wallet_balance: 1400,
    coinbase_wallet_address: '0xfg2i3j9k8l7a2b3c4d5e6f7a8b9c0d1e2f3a4b5c',
    transactions: []
  },
  {
    abha_id: '12345678901234',
    name: 'Vikram Rao',
    dateOfBirth: '1986-06-14',
    address: '741 Residency Road, Vijayawada, Andhra Pradesh - 520001',
    bloodGroup: 'B+',
    gender: 'Male',
    medicalConditions: 'Heart Disease, Emergency Care',
    emergencyContact: '+91-98765-43219',
    wallet_balance: 2900,
    coinbase_wallet_address: '0xgh3j4k0l9m8a3b4c5d6e7f8a9b0c1d2e3f4a5b6c',
    transactions: []
  }
];

async function seedUsers() {
  try {
    await connectDB();
    
    console.log('🌱 Starting user seeding...');
    
    // Clear existing users (optional - comment out if you want to keep existing users)
    // await User.deleteMany({});
    // console.log('✅ Cleared existing users');
    
    // Insert users
    const insertedUsers = [];
    for (const userData of southIndianUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ abha_id: userData.abha_id });
        if (existingUser) {
          console.log(`⚠️  User with ABHA ID ${userData.abha_id} already exists, skipping...`);
          continue;
        }
        
        const user = new User(userData);
        await user.save();
        insertedUsers.push(user);
        console.log(`✅ Created user: ${userData.name} (ABHA: ${userData.abha_id})`);
      } catch (error: any) {
        if (error.code === 11000) {
          console.log(`⚠️  User with ABHA ID ${userData.abha_id} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating user ${userData.name}:`, error.message);
        }
      }
    }
    
    console.log(`\n✅ Successfully seeded ${insertedUsers.length} users`);
    console.log('\n📋 Demo ABHA IDs:\n');
    
    southIndianUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name.padEnd(25)} ABHA ID: ${user.abha_id}`);
    });
    
    console.log('\n✅ User seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();

