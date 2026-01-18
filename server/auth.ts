import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from './models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      // For development, allow requests without token (mock user)
      // In production, this should return 401
      if (process.env.NODE_ENV === 'development') {
        // Create a mock user for development
        req.user = {
          _id: '507f1f77bcf86cd799439011', // Mock ObjectId
          abha_id: '12345678901234',
          name: 'Demo User'
        };
        return next();
      }
      return res.status(401).json({ message: 'Access token required' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Find user in database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.error('Auth error:', error);
    return res.status(500).json({ message: 'Authentication error' });
  }
};

