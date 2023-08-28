import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authMiddleware = async (req, res, next) => {
  const token = req.body.token;

  // Check if there is a token
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (decoded.verified !== true) {
      return res.status(400).json({ message: 'Account not verified' });
    }

    if (decoded.role !== 'admin' && decoded.role !== 'user') {
      return res.status(401).json({ message: 'Forbidden, Authentication failed' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

export default authMiddleware;
