import express from 'express';
import { authenticateToken } from './auth';
import { VoucherModel, HealthIdModel, HealthSchemeModel } from './database';

const router = express.Router();

// Get user's vouchers
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    
    // Find user's health ID
    const healthId = await HealthIdModel.findOne({ userId });
    
    if (!healthId) {
      // Return empty array if no health ID exists
      return res.json({ vouchers: [] });
    }
    
    // Find vouchers for this health ID
    const vouchers = await VoucherModel.find({ 
      healthIdId: healthId._id,
      status: 'active' // Only active vouchers
    }).populate('schemeId');
    
    // Transform vouchers to match the frontend interface
    const transformedVouchers = vouchers.map(voucher => {
      const scheme = voucher.schemeId as any;
      return {
        id: voucher._id.toString(),
        name: scheme?.name || 'Unknown Scheme',
        description: scheme?.description || 'Health scheme voucher',
        amount: voucher.amount,
        type: scheme?.type || 'general-health',
        validUntil: voucher.validUntil.toDateString(),
        icon: 'Heart', // Default icon, can be enhanced later
        color: 'border-medilinkx-green text-medilinkx-green' // Default color
      };
    });
    
    res.json({ vouchers: transformedVouchers });
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new voucher (when scheme is claimed)
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    const { schemeId, amount, validUntil } = req.body;
    
    // Validate required fields
    if (!schemeId || !amount || !validUntil) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Find user's health ID
    const healthId = await HealthIdModel.findOne({ userId });
    if (!healthId) {
      return res.status(404).json({ message: 'Health ID not found' });
    }
    
    // Verify the scheme exists
    const scheme = await HealthSchemeModel.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({ message: 'Health scheme not found' });
    }
    
    // Create voucher
    const voucher = await VoucherModel.create({
      healthIdId: healthId._id,
      schemeId,
      amount,
      status: 'active',
      validUntil: new Date(validUntil),
    });
    
    res.status(201).json({
      message: 'Voucher created successfully',
      voucher: {
        id: voucher._id,
        amount: voucher.amount,
        status: voucher.status,
        validUntil: voucher.validUntil,
      }
    });
    
  } catch (error) {
    console.error('Error creating voucher:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
