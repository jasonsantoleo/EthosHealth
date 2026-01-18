import express from 'express';
import { authenticateToken } from './auth';
import { HealthSchemeModel, AiRecommendationModel } from './database';

const router = express.Router();

// Generate AI recommendations
router.post('/recommendations', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    const { healthId, medicalConditions, age } = req.body;
    
    // Get all available health schemes
    const schemes = await HealthSchemeModel.find({});
    
    // Simple AI logic to match schemes based on user profile
    const recommendations = schemes.map(scheme => {
      let matchPercentage = 70; // Base match percentage
      let reasoning = 'General health coverage suitable for most users.';
      
      // Adjust match percentage based on medical conditions
      if (medicalConditions) {
        const conditions = medicalConditions.toLowerCase();
        
        if (scheme.type === 'diabetes-care' && conditions.includes('diabetes')) {
          matchPercentage = 95;
          reasoning = 'Perfect match for diabetes management based on your medical conditions.';
        } else if (scheme.type === 'emergency-care' && (conditions.includes('heart') || conditions.includes('asthma'))) {
          matchPercentage = 90;
          reasoning = 'High priority coverage recommended due to your medical conditions.';
        } else if (scheme.type === 'family-care' && age > 30) {
          matchPercentage = 85;
          reasoning = 'Family care package ideal for your age group and family planning needs.';
        }
      }
      
      // Adjust based on age
      if (age > 50 && scheme.type === 'general-health') {
        matchPercentage += 10;
        reasoning += ' Enhanced coverage recommended for your age group.';
      }
      
      return {
        id: scheme._id.toString(),
        name: scheme.name,
        description: scheme.description,
        coverage: scheme.coverage,
        processingTime: scheme.processingTime,
        networkHospitals: scheme.networkHospitals,
        matchPercentage: Math.min(matchPercentage, 100),
        reasoning,
        type: scheme.type,
      };
    });
    
    // Sort by match percentage (highest first)
    recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    // Only store AI recommendation if healthId is a valid ObjectId
    if (healthId && /^[0-9a-fA-F]{24}$/.test(healthId)) {
      await AiRecommendationModel.create({
        userId,
        healthIdId: healthId,
        recommendations: recommendations.map(rec => ({
          schemeId: rec.id,
          matchPercentage: rec.matchPercentage,
          reasoning: rec.reasoning,
        })),
        eligibilityScore: recommendations[0]?.matchPercentage || 70,
        riskLevel: age > 50 ? 'medium' : 'low',
      });
    }
    
    res.json({
      message: 'AI recommendations generated successfully',
      recommendations: recommendations.slice(0, 5), // Return top 5 recommendations
    });
    
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
