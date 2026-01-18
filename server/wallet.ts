import express from 'express';
import { authenticateToken } from './auth';
import { CoinbaseWalletModel } from './database';

const router = express.Router();

// Get wallet balance
router.get('/balance', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    
    // Find user's wallet
    const wallet = await CoinbaseWalletModel.findOne({ userId });
    
    if (!wallet) {
      // Return 0 balance if no wallet exists
      return res.json({ balance: 0 });
    }
    
    res.json({ balance: wallet.balance || 0 });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get wallet details
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    
    // Find user's wallet
    const wallet = await CoinbaseWalletModel.findOne({ userId });
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    
    res.json({
      wallet: {
        id: wallet._id,
        walletAddress: wallet.walletAddress,
        walletName: wallet.walletName,
        balance: wallet.balance,
        currency: wallet.currency,
        isActive: wallet.isActive,
      }
    });
  } catch (error) {
    console.error('Error fetching wallet details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
