import { Router } from 'express';

const router = Router();

// Mock schemes data
const mockSchemes = [
  {
    id: 'pmjay-001',
    name: 'Ayushman Bharat - PM-JAY',
    provider: 'Government of India',
    description: 'Health insurance coverage up to ₹5 lakh per family per year',
    benefits: 'Covers hospitalization expenses, pre and post hospitalization, day care procedures',
    max_benefit_amount: 500000,
    website_url: 'https://pmjay.gov.in',
    contact_info: '1800-111-565',
    tags: ['government', 'insurance', 'hospitalization'],
    eligibility_criteria: ['BPL families', 'Rural areas', 'Urban areas'],
    documents_required: ['Aadhaar card', 'Income certificate', 'Caste certificate']
  },
  {
    id: 'rsby-005',
    name: 'Rashtriya Swasthya Bima Yojana',
    provider: 'Government of India',
    description: 'Health insurance for BPL families with smart card-based cashless health insurance',
    benefits: 'Covers hospitalization expenses up to ₹30,000 per annum',
    max_benefit_amount: 30000,
    website_url: 'https://www.rsby.gov.in',
    contact_info: '1800-180-1104',
    tags: ['government', 'BPL', 'smart-card'],
    eligibility_criteria: ['BPL families', 'Unorganized sector workers'],
    documents_required: ['BPL certificate', 'Smart card', 'Aadhaar card']
  },
  {
    id: 'cg-hsg-003',
    name: 'Chhattisgarh Health Scheme',
    provider: 'Government of Chhattisgarh',
    description: 'Comprehensive health coverage for residents of Chhattisgarh',
    benefits: 'Covers OPD, diagnostics, medicines, and hospitalization',
    max_benefit_amount: 200000,
    website_url: 'https://cghealth.nic.in',
    contact_info: '1800-233-3333',
    tags: ['state-government', 'comprehensive', 'residents'],
    eligibility_criteria: ['Chhattisgarh residents', 'All income levels'],
    documents_required: ['Residence certificate', 'Aadhaar card']
  }
];

// Get all schemes
router.get('/', async (req, res) => {
  try {
    res.json({
      success: true,
      schemes: mockSchemes
    });
  } catch (error) {
    console.error('Get schemes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Search schemes (must be before /:schemeId route)
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const searchTerm = query.toLowerCase();
    
    const filteredSchemes = mockSchemes.filter(scheme => 
      scheme.name.toLowerCase().includes(searchTerm) ||
      scheme.description.toLowerCase().includes(searchTerm) ||
      scheme.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    res.json({
      success: true,
      query: query,
      schemes: filteredSchemes,
      total_count: filteredSchemes.length
    });
  } catch (error) {
    console.error('Search schemes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Apply to a scheme (must be before /:schemeId route)
router.post('/:schemeId/apply', async (req, res) => {
  try {
    const { schemeId } = req.params;
    const { abhaId } = req.body;
    
    if (!abhaId) {
      return res.status(400).json({
        success: false,
        message: 'ABHA ID is required'
      });
    }
    
    const scheme = mockSchemes.find(s => s.id === schemeId);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }
    
    // Simulate application processing
    // In a real app, this would interact with government APIs
    
    res.json({
      success: true,
      message: `Application for ${scheme.name} submitted successfully`,
      applicationId: `APP-${Date.now()}-${schemeId}`,
      scheme: {
        id: scheme.id,
        name: scheme.name,
        status: 'pending',
        submittedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Apply scheme error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get scheme guide (must be before /:schemeId route)
router.get('/:schemeId/guide', async (req, res) => {
  try {
    const { schemeId } = req.params;
    const scheme = mockSchemes.find(s => s.id === schemeId);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }
    
    const guide = {
      scheme_id: scheme.id,
      scheme_name: scheme.name,
      application_process: [
        'Visit the official website',
        'Fill out the application form',
        'Upload required documents',
        'Submit for verification',
        'Receive approval notification'
      ],
      documents_required: scheme.documents_required,
      eligibility_criteria: scheme.eligibility_criteria,
      benefits: scheme.benefits,
      contact_information: scheme.contact_info,
      website: scheme.website_url
    };
    
    res.json({
      success: true,
      guide: guide
    });
  } catch (error) {
    console.error('Get scheme guide error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get scheme by ID (must be last to avoid conflicts)
router.get('/:schemeId', async (req, res) => {
  try {
    const { schemeId } = req.params;
    const scheme = mockSchemes.find(s => s.id === schemeId);
    
    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }
    
    res.json({
      success: true,
      scheme: scheme
    });
  } catch (error) {
    console.error('Get scheme error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
