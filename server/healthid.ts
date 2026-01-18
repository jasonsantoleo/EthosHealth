import express from 'express';
import { authenticateToken } from './auth';
import { HealthIdModel, CoinbaseWalletModel } from './database';
import { CreateHealthIdForm } from '@shared/schema';

const router = express.Router();

// Create new HealthID
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    const healthData: CreateHealthIdForm = req.body;

    // Check if user already has a HealthID
    const existingHealthId = await HealthIdModel.findOne({ userId });
    if (existingHealthId) {
      return res.status(400).json({ message: 'User already has a HealthID' });
    }

    // Create a new Coinbase wallet for the user
    const walletAddress = '0x' + Math.random().toString(16).substr(2, 40).toUpperCase();
    const coinbaseWallet = await CoinbaseWalletModel.create({
      userId,
      walletAddress,
      walletName: 'Coinbase Wallet',
      balance: 0,
      currency: 'USD',
      isActive: true,
    });

    // Create the HealthID
    const healthId = await HealthIdModel.create({
      userId,
      coinbaseWalletId: coinbaseWallet._id,
      patientName: healthData.patientName,
      dateOfBirth: healthData.dateOfBirth,
      nationalId: healthData.nationalId,
      bloodGroup: healthData.bloodGroup,
      gender: healthData.gender,
      medicalConditions: healthData.medicalConditions,
      emergencyContact: healthData.emergencyContact,
      status: 'active',
    });

    res.status(201).json({
      message: 'HealthID created successfully',
      healthId: {
        id: healthId._id,
        patientName: healthId.patientName,
        nationalId: healthId.nationalId,
        status: healthId.status,
        createdAt: healthId.createdAt,
      },
      wallet: {
        id: coinbaseWallet._id,
        walletAddress: coinbaseWallet.walletAddress,
        balance: coinbaseWallet.balance,
        currency: coinbaseWallet.currency,
      },
    });
  } catch (error) {
    console.error('Error creating HealthID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's HealthID
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;

    const healthId = await HealthIdModel.findOne({ userId }).populate('coinbaseWalletId');
    
    if (!healthId) {
      return res.status(404).json({ message: 'HealthID not found' });
    }

    res.json({
      healthId: {
        id: healthId._id,
        patientName: healthId.patientName,
        dateOfBirth: healthId.dateOfBirth,
        nationalId: healthId.nationalId,
        bloodGroup: healthId.bloodGroup,
        gender: healthId.gender,
        medicalConditions: healthId.medicalConditions,
        emergencyContact: healthId.emergencyContact,
        status: healthId.status,
        createdAt: healthId.createdAt,
        updatedAt: healthId.updatedAt,
        wallet: healthId.coinbaseWalletId,
      },
    });
  } catch (error) {
    console.error('Error fetching HealthID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
