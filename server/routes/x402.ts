import { Router } from 'express';
import { x402Service } from '../services/x402.js';

const router = Router();

// Get treasury balance
router.get('/treasury', async (req, res) => {
  try {
    const balance = await x402Service.getTreasuryBalance();
    
    res.json({
      success: true,
      treasury: {
        id: 'treasury-001',
        balance: balance,
        currency: 'USDC',
        last_updated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get treasury error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Donate to treasury
router.post('/donate', async (req, res) => {
  try {
    const { amount, donor_address, message } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // Mock donation processing
    const donationId = `donation-${Date.now()}`;
    
    res.json({
      success: true,
      message: 'Donation successful',
      donation_id: donationId,
      amount: amount,
      donor_address: donor_address || 'Anonymous',
      message: message || 'Healthcare for all'
    });
  } catch (error) {
    console.error('Donate error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create voucher
router.post('/create-voucher', async (req, res) => {
  try {
    const { beneficiary_id, amount, description } = req.body;

    if (!beneficiary_id || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid beneficiary ID and amount are required'
      });
    }

    const voucherId = await x402Service.createVoucher(beneficiary_id, amount, description);
    
    res.json({
      success: true,
      message: 'Voucher created successfully',
      voucher_id: voucherId,
      beneficiary_id: beneficiary_id,
      amount: amount,
      description: description
    });
  } catch (error) {
    console.error('Create voucher error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Validate voucher
router.post('/validate-voucher', async (req, res) => {
  try {
    const { voucher_id } = req.body;

    if (!voucher_id) {
      return res.status(400).json({
        success: false,
        message: 'Voucher ID is required'
      });
    }

    const isValid = await x402Service.validateVoucher(voucher_id);
    
    res.json({
      success: true,
      voucher_id: voucher_id,
      is_valid: isValid,
      validation_timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Validate voucher error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Redeem voucher
router.post('/redeem-voucher', async (req, res) => {
  try {
    const { voucher_id, hospital_address, amount } = req.body;

    if (!voucher_id || !hospital_address || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Voucher ID, hospital address, and amount are required'
      });
    }

    const transactionId = await x402Service.redeemVoucher(voucher_id, hospital_address, amount);
    
    res.json({
      success: true,
      message: 'Voucher redeemed successfully',
      transaction_id: transactionId,
      voucher_id: voucher_id,
      hospital_address: hospital_address,
      amount: amount,
      gas_fee: 0, // Gasless transaction
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Redeem voucher error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Convert to fiat
router.post('/convert-to-fiat', async (req, res) => {
  try {
    const { amount, from_currency, to_currency } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    const fiatAmount = await x402Service.convertToFiat(
      amount, 
      from_currency || 'USDC', 
      to_currency || 'INR'
    );
    
    res.json({
      success: true,
      message: 'Conversion successful',
      original_amount: amount,
      original_currency: from_currency || 'USDC',
      converted_amount: fiatAmount,
      converted_currency: to_currency || 'INR',
      conversion_rate: fiatAmount / amount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Convert to fiat error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get voucher details
router.get('/voucher/:voucherId', async (req, res) => {
  try {
    const { voucherId } = req.params;

    const voucherDetails = await x402Service.getVoucherDetails(voucherId);
    
    res.json({
      success: true,
      voucher: voucherDetails
    });
  } catch (error) {
    console.error('Get voucher details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get beneficiary vouchers
router.get('/beneficiary/:beneficiaryId/vouchers', async (req, res) => {
  try {
    const { beneficiaryId } = req.params;

    const vouchers = await x402Service.getBeneficiaryVouchers(beneficiaryId);
    
    res.json({
      success: true,
      beneficiary_id: beneficiaryId,
      vouchers: vouchers,
      total_count: vouchers.length
    });
  } catch (error) {
    console.error('Get beneficiary vouchers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get transaction history
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await x402Service.getTransactionHistory();
    
    res.json({
      success: true,
      transactions: transactions,
      total_count: transactions.length
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get gasless stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await x402Service.getGaslessStats();
    
    res.json({
      success: true,
      gasless_stats: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create wallet
router.post('/create-wallet', async (req, res) => {
  try {
    const { abha_id } = req.body;

    if (!abha_id) {
      return res.status(400).json({
        success: false,
        message: 'ABHA ID is required'
      });
    }

    const walletAddress = await x402Service.createWallet(abha_id);
    
    res.json({
      success: true,
      message: 'Wallet created successfully',
      abha_id: abha_id,
      wallet_address: walletAddress,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Create wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
