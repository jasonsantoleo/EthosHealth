import mongoose from 'mongoose';
import { connectToMongoDB } from './mongodb';

// Connect to MongoDB
export async function connectDB() {
  await connectToMongoDB();
}

// Health Scheme Schema
const HealthSchemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  coverage: { type: Number, required: true },
  processingTime: { type: String, required: true },
  networkHospitals: { type: Number, required: true },
  matchPercentage: { type: Number, default: 0 },
  type: { 
    type: String, 
    enum: ['diabetes-care', 'general-health', 'family-care', 'emergency-care'],
    required: true 
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Health ID Schema
const HealthIdSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coinbaseWalletId: { type: mongoose.Schema.Types.ObjectId, ref: 'CoinbaseWallet' },
  patientName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  nationalId: { type: String, required: true, unique: true },
  bloodGroup: { type: String },
  gender: { type: String },
  medicalConditions: { type: String },
  emergencyContact: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Voucher Schema
const VoucherSchema = new mongoose.Schema({
  healthIdId: { type: mongoose.Schema.Types.ObjectId, ref: 'HealthId', required: true },
  schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'HealthScheme', required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['active', 'claimed', 'expired'], 
    default: 'active' 
  },
  validUntil: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// AI Recommendation Schema
const AiRecommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  healthIdId: { type: mongoose.Schema.Types.ObjectId, ref: 'HealthId' },
  recommendations: [{
    schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'HealthScheme' },
    matchPercentage: { type: Number, required: true },
    reasoning: { type: String, required: true }
  }],
  eligibilityScore: { type: Number, required: true },
  riskLevel: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'low' 
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Coinbase Wallet Schema
const CoinbaseWalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  walletAddress: { type: String, required: true, unique: true },
  walletName: { type: String, default: 'Coinbase Wallet' },
  balance: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  isActive: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Hospital Schema
const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  specializations: [{ type: String }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  availableServices: [{ type: String }],
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  isActive: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Create indexes for better query performance
HospitalSchema.index({ coordinates: '2dsphere' });
HospitalSchema.index({ city: 1 });
HospitalSchema.index({ state: 1 });

// Export Models
export const HealthSchemeModel = mongoose.models.HealthScheme || mongoose.model('HealthScheme', HealthSchemeSchema);
export const HealthIdModel = mongoose.models.HealthId || mongoose.model('HealthId', HealthIdSchema);
export const VoucherModel = mongoose.models.Voucher || mongoose.model('Voucher', VoucherSchema);
export const AiRecommendationModel = mongoose.models.AiRecommendation || mongoose.model('AiRecommendation', AiRecommendationSchema);
export const CoinbaseWalletModel = mongoose.models.CoinbaseWallet || mongoose.model('CoinbaseWallet', CoinbaseWalletSchema);
export const HospitalModel = mongoose.models.Hospital || mongoose.model('Hospital', HospitalSchema);

