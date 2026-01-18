import { connectDB, HospitalModel } from './database';

const sampleHospitals = [
  // Chennai Hospitals
  {
    name: 'Apollo Hospitals',
    location: 'Greams Road, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    coordinates: {
      lat: 13.0604,
      lng: 80.2496
    },
    specializations: ['Cardiology', 'Diabetes Care', 'General Surgery', 'Oncology'],
    rating: 4.8,
    availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Diagnostics', 'ICU'],
    phone: '+91-44-2829-3333',
    email: 'info@apollohospitals.com',
    website: 'https://www.apollohospitals.com',
    isActive: true
  },
  {
    name: 'Fortis Malar Hospital',
    location: 'Adyar, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    coordinates: {
      lat: 12.9716,
      lng: 80.2206
    },
    specializations: ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency Medicine'],
    rating: 4.6,
    availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Trauma Center', 'ICU'],
    phone: '+91-44-4200-2222',
    email: 'info@fortismalar.com',
    website: 'https://www.fortishealthcare.com',
    isActive: true
  },
  {
    name: 'MIOT International',
    location: 'Manapakkam, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    coordinates: {
      lat: 13.0067,
      lng: 80.1833
    },
    specializations: ['Orthopedics', 'Cardiology', 'General Surgery', 'Urology'],
    rating: 4.7,
    availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Diagnostics', 'Surgery'],
    phone: '+91-44-2249-2288',
    email: 'info@miot.in',
    website: 'https://www.miot.in',
    isActive: true
  },
  {
    name: 'Gleneagles Global Hospitals',
    location: 'Perumbakkam, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    coordinates: {
      lat: 12.9010,
      lng: 80.2209
    },
    specializations: ['Oncology', 'Cardiology', 'Neurology', 'Transplant'],
    rating: 4.5,
    availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Research', 'Specialized Care'],
    phone: '+91-44-4477-7777',
    email: 'info@gleneaglesglobalhospitals.com',
    website: 'https://www.gleneaglesglobalhospitals.com',
    isActive: true
  },
  {
    name: 'Sri Ramachandra Medical Centre',
    location: 'Porur, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    coordinates: {
      lat: 13.0358,
      lng: 80.1561
    },
    specializations: ['Cardiology', 'General Medicine', 'Pediatrics', 'Gynecology'],
    rating: 4.4,
    availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Diagnostics'],
    phone: '+91-44-2476-8000',
    email: 'info@sriramachandra.edu.in',
    website: 'https://www.sriramachandra.edu.in',
    isActive: true
  },
  // Trichy Hospitals
  {
    name: 'Apollo Speciality Hospitals',
    location: 'Race Course Road, Trichy',
    city: 'Trichy',
    state: 'Tamil Nadu',
    coordinates: {
      lat: 10.7905,
      lng: 78.7047
    },
    specializations: ['Cardiology', 'Diabetes Care', 'General Surgery', 'Nephrology'],
    rating: 4.7,
    availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Diagnostics', 'Dialysis'],
    phone: '+91-431-407-7777',
    email: 'info@apollohospitals.com',
    website: 'https://www.apollohospitals.com',
    isActive: true
  },
  {
    name: 'Kaveri Medical Centre',
    location: 'Thillai Nagar, Trichy',
    city: 'Trichy',
    state: 'Tamil Nadu',
    coordinates: {
      lat: 10.8045,
      lng: 78.6884
    },
    specializations: ['Cardiology', 'Orthopedics', 'General Medicine', 'Pediatrics'],
    rating: 4.5,
    availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Diagnostics'],
    phone: '+91-431-276-0000',
    email: 'info@kaverimedical.com',
    website: 'https://www.kaverimedical.com',
    isActive: true
  },
  {
    name: 'Sri Ramakrishna Hospital',
    location: 'Srirangam, Trichy',
    city: 'Trichy',
    state: 'Tamil Nadu',
    coordinates: {
      lat: 10.8631,
      lng: 78.6869
    },
    specializations: ['General Medicine', 'Surgery', 'Gynecology', 'Pediatrics'],
    rating: 4.3,
    availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Maternity Care'],
    phone: '+91-431-243-3333',
    email: 'info@sriramakrishnahospital.com',
    website: 'https://www.sriramakrishnahospital.com',
    isActive: true
  },
  {
    name: 'Vijaya Hospital',
    location: 'Cantonment, Trichy',
    city: 'Trichy',
    state: 'Tamil Nadu',
    coordinates: {
      lat: 10.8050,
      lng: 78.6910
    },
    specializations: ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency Medicine'],
    rating: 4.4,
    availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Trauma Center'],
    phone: '+91-431-241-4141',
    email: 'info@vijayahospital.com',
    website: 'https://www.vijayahospital.com',
    isActive: true
  },
  {
    name: 'Mahatma Gandhi Memorial Government Hospital',
    location: 'Fort Station Road, Trichy',
    city: 'Trichy',
    state: 'Tamil Nadu',
    coordinates: {
      lat: 10.7905,
      lng: 78.7047
    },
    specializations: ['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology'],
    rating: 4.2,
    availableServices: ['Emergency Care', 'OPD', 'Inpatient', 'Public Health Services'],
    phone: '+91-431-241-4000',
    email: 'info@mgmgh.gov.in',
    website: 'https://www.mgmgh.gov.in',
    isActive: true
  }
];

async function seedHospitals() {
  try {
    await connectDB();
    
    // Clear existing hospitals
    await HospitalModel.deleteMany({});
    console.log('✅ Cleared existing hospitals');
    
    // Insert sample hospitals
    const insertedHospitals = await HospitalModel.insertMany(sampleHospitals);
    console.log(`✅ Inserted ${insertedHospitals.length} hospitals`);
    
    console.log('✅ Hospital database seeding completed successfully');
    console.log(`   - Chennai hospitals: 5`);
    console.log(`   - Trichy hospitals: 5`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding hospital database:', error);
    process.exit(1);
  }
}

seedHospitals();

