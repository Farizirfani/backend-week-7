import userController from '../userController.js';
import User from '../../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock the response object
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe('userController', () => {
  describe('getAllUsers', () => {
    it('should fetch all users successfully', async () => {
      const mockUsers = [{ username: 'user1' }, { username: 'user2' }];

      // Mocking User.find to return the mockUsers
      User.find = jest.fn().mockResolvedValue(mockUsers);

      const req = {};

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Users fetched successfully',
        status: 200,
        data: mockUsers,
      });
    });

    it('should handle "Users not found" scenario', async () => {
      // Mocking User.find to return an empty array
      // res.status.mockClear();
      // res.json.mockClear();

      const req = {};

      // User.find = jest.fn().mockResolvedValue([]);
      User.find.mockResolvedValue([]);

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Users not found' });
    });

    // Mocking User.find to throw an error
    it('should handle errors with status 500', async () => {
      res.status.mockClear();
      res.json.mockClear();

      User.find = jest.fn().mockRejectedValue(new Error('Database error'));

      const req = {};

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Database error',
      });
    });
  });

  describe('getUserById', () => {
    it('should fetch a user successfully', async () => {
      // Mocking User.findById to return a user
      User.findById = jest.fn().mockResolvedValue({
        _id: 'user_id',
        username: 'testuser',
        email: 'test@example.com',
        verified: true,
      });

      const req = {
        params: {
          id: 'user_id',
        },
      };

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User fetched successfully',
        status: 200,
        data: {
          name: 'testuser',
          email: 'test@example.com',
          verified: true,
        },
      });
    });

    it('should handle "User not found" scenario', async () => {
      // Mocking User.findById to return null (user not found)

      res.status.mockClear();
      res.json.mockClear();
      User.findById = jest.fn().mockResolvedValue({
        username: 'testuser',
      });

      const req = {
        params: {
          id: 'nonexistent_id',
        },
      };

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should handle error', async () => {
      // Mocking User.findById to throw an error
      User.findById = jest.fn().mockRejectedValue(new Error('Some error'));

      const req = {
        params: {
          id: 'user_id',
        },
      };

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Some error' });
    });
  });
});
