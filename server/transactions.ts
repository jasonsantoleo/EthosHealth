import express from 'express';
import { authenticateToken } from './auth';
import { TransactionModel, VoucherModel, HealthIdModel } from './database';

const router = express.Router();

// Get transaction count
router.get('/count', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    
    // Count user's transactions
    const count = await TransactionModel.countDocuments({ userId });
    
    res.json({ count });
  } catch (error) {
    console.error('Error fetching transaction count:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new transaction
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    const { voucherId, hospitalName, amount } = req.body;
    
    // Validate required fields
    if (!voucherId || !hospitalName || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Find user's health ID and wallet
    const healthId = await HealthIdModel.findOne({ userId });
    if (!healthId) {
      return res.status(404).json({ message: 'Health ID not found' });
    }
    
    // Find the voucher
    const voucher = await VoucherModel.findById(voucherId);
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }
    
    // Check if voucher belongs to user
    if (voucher.healthIdId.toString() !== healthId._id.toString()) {
      return res.status(403).json({ message: 'Voucher does not belong to user' });
    }
    
    // Check if voucher is active
    if (voucher.status !== 'active') {
      return res.status(400).json({ message: 'Voucher is not active' });
    }
    
    // Generate transaction ID
    const transactionId = `TXN${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Create transaction
    const transaction = await TransactionModel.create({
      userId,
      voucherId,
      hospitalName,
      amount,
      status: 'completed',
      transactionId,
      coinbaseWalletId: healthId.coinbaseWalletId, // This should be populated when wallet is created
    });
    
    // Update voucher status to claimed
    await VoucherModel.findByIdAndUpdate(voucherId, { status: 'claimed' });
    
    res.status(201).json({
      message: 'Transaction created successfully',
      transaction: {
        id: transaction._id,
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        hospitalName: transaction.hospitalName,
        status: transaction.status,
      }
    });
    
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's transactions
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    
    // Get user's transactions
    const transactions = await TransactionModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10); // Limit to recent transactions
    
    res.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
