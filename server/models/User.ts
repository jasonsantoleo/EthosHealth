import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, required: true, enum: ['fund', 'transfer', 'payment'] },
  amount: { type: Number, required: true },
  status: { type: String, required: true, enum: ['pending', 'completed', 'failed'] },
  timestamp: { type: Date, required: true },
  description: { type: String, required: true },
  recipient: { type: String },
  transaction_hash: { type: String }
});

const UserSchema = new mongoose.Schema({
  abha_id: { 
    type: String, 
    required: true, 
    unique: true, 
    validate: {
      validator: function(v: string) {
        return /^\d{14}$/.test(v);
      },
      message: 'ABHA ID must be exactly 14 digits'
    }
  },
  name: { type: String, required: true },
  dateOfBirth: { type: String },
  address: { type: String },
  bloodGroup: { type: String },
  gender: { type: String },
  medicalConditions: { type: String },
  emergencyContact: { type: String },
  wallet_balance: { type: Number, default: 0 },
  coinbase_wallet_address: { type: String, default: '' },
  transactions: [TransactionSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Update timestamp on save
UserSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export const User = mongoose.model('User', UserSchema);
