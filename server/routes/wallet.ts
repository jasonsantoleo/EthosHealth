import { Router } from 'express';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { coinbaseService } from '../services/coinbase.js';

const router = Router();

// Register new user with ABHA ID
router.post('/register', async (req, res) => {
  try {
    const { abha_id, name, dateOfBirth } = req.body;

    if (!abha_id || !name) {
      return res.status(400).json({
        success: false,
        message: 'ABHA ID and name are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ abha_id });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this ABHA ID already exists'
      });
    }

    // Create new user
    const user = new User({
      abha_id,
      name,
      dateOfBirth: dateOfBirth || '1988-05-15',
      wallet_balance: 0,
      coinbase_wallet_address: '',
      transactions: []
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        abha_id: user.abha_id,
        name: user.name,
        wallet_balance: user.wallet_balance,
        coinbase_wallet_address: user.coinbase_wallet_address
      }
    });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get wallet balance for a user
router.get('/wallet/:abha_id', async (req, res) => {
  try {
    const { abha_id } = req.params;

    const user = await User.findOne({ abha_id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      wallet_balance: user.wallet_balance,
      coinbase_wallet_address: user.coinbase_wallet_address
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update wallet information
router.post('/wallet/update', async (req, res) => {
  try {
    const { abha_id, wallet_balance, coinbase_wallet_address } = req.body;

    const user = await User.findOne({ abha_id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (wallet_balance !== undefined) {
      user.wallet_balance = wallet_balance;
    }
    if (coinbase_wallet_address) {
      user.coinbase_wallet_address = coinbase_wallet_address;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Wallet updated successfully',
      wallet_balance: user.wallet_balance,
      coinbase_wallet_address: user.coinbase_wallet_address
    });
  } catch (error) {
    console.error('Update wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Connect Coinbase wallet
router.post('/connect-wallet', async (req, res) => {
  try {
    const { abha_id } = req.body;

    const user = await User.findOne({ abha_id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create or get Coinbase wallet
    let walletAddress = user.coinbase_wallet_address;
    if (!walletAddress) {
      walletAddress = await coinbaseService.createWallet(abha_id);
      user.coinbase_wallet_address = walletAddress;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Wallet connected successfully',
      wallet_address: walletAddress
    });
  } catch (error) {
    console.error('Connect wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Fund wallet
router.post('/fund-wallet', async (req, res) => {
  try {
    const { abha_id, amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    const user = await User.findOne({ abha_id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.coinbase_wallet_address) {
      return res.status(400).json({
        success: false,
        message: 'Wallet not connected'
      });
    }

    // Fund the wallet
    const success = await coinbaseService.fundWallet(user.coinbase_wallet_address, amount);
    
    if (success) {
      // Update local balance
      user.wallet_balance += amount;
      
      // Add transaction record
      const transaction = {
        id: `tx-${Date.now()}`,
        type: 'fund',
        amount: amount,
        status: 'completed',
        timestamp: new Date(),
        description: 'Wallet funding'
      };
      
      user.transactions.push(transaction);
      await user.save();

      res.json({
        success: true,
        message: 'Wallet funded successfully',
        new_balance: user.wallet_balance
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to fund wallet'
      });
    }
  } catch (error) {
    console.error('Fund wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Send payment
router.post('/send-payment', async (req, res) => {
  try {
    const { abha_id, recipient_address, amount } = req.body;

    if (!recipient_address || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid recipient address and amount are required'
      });
    }

    const user = await User.findOne({ abha_id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.wallet_balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Send payment
    const transactionId = await coinbaseService.sendPayment(
      user.coinbase_wallet_address,
      recipient_address,
      amount
    );

    if (transactionId) {
      // Update local balance
      user.wallet_balance -= amount;
      
      // Add transaction record
      const transaction = {
        id: `tx-${Date.now()}`,
        type: 'transfer',
        amount: -amount,
        status: 'completed',
        timestamp: new Date(),
        description: `Payment to ${recipient_address}`,
        recipient: recipient_address,
        transaction_hash: transactionId
      };
      
      user.transactions.push(transaction);
      await user.save();

      res.json({
        success: true,
        message: 'Payment sent successfully',
        transaction_id: transactionId,
        new_balance: user.wallet_balance
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send payment'
      });
    }
  } catch (error) {
    console.error('Send payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user profile
router.get('/user/:abha_id', async (req, res) => {
  try {
    const { abha_id } = req.params;

    const user = await User.findOne({ abha_id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        abha_id: user.abha_id,
        name: user.name,
        dateOfBirth: (user as any).dateOfBirth || '1988-05-15',
        address: (user as any).address || 'Address not available',
        bloodGroup: (user as any).bloodGroup || 'Not specified',
        gender: (user as any).gender || 'Not specified',
        medicalConditions: (user as any).medicalConditions || 'None',
        emergencyContact: (user as any).emergencyContact || 'Not provided',
        wallet_balance: user.wallet_balance,
        coinbase_wallet_address: user.coinbase_wallet_address,
        transactions: user.transactions
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all users (for admin purposes)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { 
      abha_id: 1, 
      name: 1, 
      wallet_balance: 1, 
      coinbase_wallet_address: 1,
      created_at: 1 
    });

    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get Coinbase wallet details
router.get('/coinbase-wallet/:abha_id', async (req, res) => {
  try {
    const { abha_id } = req.params;

    const user = await User.findOne({ abha_id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.coinbase_wallet_address) {
      return res.status(400).json({
        success: false,
        message: 'Wallet not connected'
      });
    }

    // Get wallet balance from Coinbase
    const balance = await coinbaseService.getWalletBalance(user.coinbase_wallet_address);
    
    // Get transaction history
    const transactions = await coinbaseService.getTransactionHistory(user.coinbase_wallet_address);

    res.json({
      success: true,
      wallet: {
        address: user.coinbase_wallet_address,
        balance: balance,
        transactions: transactions
      }
    });
  } catch (error) {
    console.error('Get Coinbase wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Simulate transaction (for demo purposes)
router.post('/simulate-transaction', async (req, res) => {
  try {
    const { abha_id, amount, type } = req.body;

    const user = await User.findOne({ abha_id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Simulate transaction
    const transaction = {
      id: `tx-${Date.now()}`,
      type: type || 'simulation',
      amount: amount || 100,
      status: 'completed',
      timestamp: new Date(),
      description: 'Simulated transaction'
    };

    user.transactions.push(transaction);
    await user.save();

    res.json({
      success: true,
      message: 'Transaction simulated successfully',
      transaction: transaction
    });
  } catch (error) {
    console.error('Simulate transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
