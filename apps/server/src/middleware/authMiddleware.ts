import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User, { IUserDocument } from '../models/userModel';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: IUserDocument;
}

interface JwtPayload {
  id: string;
}

const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, please login');
    }

    // Verify Token
    const verified = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Get user id from token
    const user = await User.findById(verified.id).select('-password');

    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expired, please login again');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token, please login again');
    }
    throw new Error('Not authorized, please login');
  }
});

export default protect;

