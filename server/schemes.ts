import express from 'express';
import { authenticateToken } from './auth';
import { HealthSchemeModel } from './database';

const router = express.Router();

// Get all available health schemes
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    const schemes = await HealthSchemeModel.find({});
    
    res.json({
      schemes: schemes.map(scheme => ({
        id: scheme._id,
        name: scheme.name,
        description: scheme.description,
        coverage: scheme.coverage,
        processingTime: scheme.processingTime,
        networkHospitals: scheme.networkHospitals,
        matchPercentage: scheme.matchPercentage,
        type: scheme.type,
      })),
    });
  } catch (error) {
    console.error('Error fetching schemes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get scheme by ID
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const scheme = await HealthSchemeModel.findById(req.params.id);
    
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }
    
    res.json({
      scheme: {
        id: scheme._id,
        name: scheme.name,
        description: scheme.description,
        coverage: scheme.coverage,
        processingTime: scheme.processingTime,
        networkHospitals: scheme.networkHospitals,
        matchPercentage: scheme.matchPercentage,
        type: scheme.type,
      },
    });
  } catch (error) {
    console.error('Error fetching scheme:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
