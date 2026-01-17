import express from 'express';
import { authenticateToken } from '../auth.js';
import { HospitalModel } from '../database.js';
import { isMongoDBConnected } from '../mongodb.js';

const router = express.Router();

// Get all hospitals
router.get('/', authenticateToken, async (req: any, res) => {
  try {
    // Check if MongoDB is connected
    if (!isMongoDBConnected()) {
      // Return empty array if DB not connected (frontend uses localStorage/mock data)
      return res.json({ hospitals: [] });
    }

    const { city, state, specialization } = req.query;
    
    let query: any = { isActive: true };
    
    if (city) {
      query.city = new RegExp(city, 'i');
    }
    
    if (state) {
      query.state = new RegExp(state, 'i');
    }
    
    if (specialization) {
      query.specializations = { $in: [new RegExp(specialization, 'i')] };
    }
    
    const hospitals = await HospitalModel.find(query);
    
    res.json({
      hospitals: hospitals.map(hospital => ({
        id: hospital._id.toString(),
        name: hospital.name,
        location: hospital.location,
        city: hospital.city,
        state: hospital.state,
        coordinates: hospital.coordinates,
        specializations: hospital.specializations,
        rating: hospital.rating,
        availableServices: hospital.availableServices,
        phone: hospital.phone,
        email: hospital.email,
        website: hospital.website,
      })),
    });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    // Return empty array on error (frontend will use mock data)
    res.json({ hospitals: [] });
  }
});

// Get hospitals by city
router.get('/city/:city', authenticateToken, async (req: any, res) => {
  try {
    if (!isMongoDBConnected()) {
      return res.json({ hospitals: [] });
    }

    const city = req.params.city;
    const hospitals = await HospitalModel.find({ 
      city: new RegExp(city, 'i'),
      isActive: true 
    });
    
    res.json({
      hospitals: hospitals.map(hospital => ({
        id: hospital._id.toString(),
        name: hospital.name,
        location: hospital.location,
        city: hospital.city,
        state: hospital.state,
        coordinates: hospital.coordinates,
        specializations: hospital.specializations,
        rating: hospital.rating,
        availableServices: hospital.availableServices,
        phone: hospital.phone,
        email: hospital.email,
        website: hospital.website,
      })),
    });
  } catch (error) {
    console.error('Error fetching hospitals by city:', error);
    res.json({ hospitals: [] });
  }
});

// Get hospitals near a location (within radius in km)
router.get('/nearby', authenticateToken, async (req: any, res) => {
  try {
    if (!isMongoDBConnected()) {
      return res.json({ hospitals: [] });
    }

    const { lat, lng, radius = 10 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const radiusKm = parseFloat(radius as string);
    
    // Find hospitals within radius using geospatial query
    const hospitals = await HospitalModel.find({
      isActive: true,
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: radiusKm * 1000 // Convert km to meters
        }
      }
    });
    
    res.json({
      hospitals: hospitals.map(hospital => ({
        id: hospital._id.toString(),
        name: hospital.name,
        location: hospital.location,
        city: hospital.city,
        state: hospital.state,
        coordinates: hospital.coordinates,
        specializations: hospital.specializations,
        rating: hospital.rating,
        availableServices: hospital.availableServices,
        phone: hospital.phone,
        email: hospital.email,
        website: hospital.website,
      })),
    });
  } catch (error) {
    console.error('Error fetching nearby hospitals:', error);
    res.json({ hospitals: [] });
  }
});

// Get hospital by ID
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    if (!isMongoDBConnected()) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const hospital = await HospitalModel.findById(req.params.id);
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    
    res.json({
      hospital: {
        id: hospital._id.toString(),
        name: hospital.name,
        location: hospital.location,
        city: hospital.city,
        state: hospital.state,
        coordinates: hospital.coordinates,
        specializations: hospital.specializations,
        rating: hospital.rating,
        availableServices: hospital.availableServices,
        phone: hospital.phone,
        email: hospital.email,
        website: hospital.website,
      },
    });
  } catch (error) {
    console.error('Error fetching hospital:', error);
    res.status(404).json({ message: 'Hospital not found' });
  }
});

export default router;

