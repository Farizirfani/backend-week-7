import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import otpGenerator from 'otp-generator';
import jwt from 'jsonwebtoken';

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      if (users.length > 0) {
        res.status(200).json({
          message: 'Users fetched successfully',
          status: 200,
          data: users,
        });
      } else {
        res.status(400).json({ message: 'Users not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      res.status(200).json({
        message: 'User fetched successfully',
        status: 200,
        data: {
          name: user.username,
          email: user.email,
          verified: user.verified,
        },
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { email } = req.params;

      // Cari pengguna berdasarkan email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          status: 'error',
          message: 'User not found',
        });
      }

      // Ubah status verifikasi pengguna menjadi true
      user.verified = true;
      await user.save();

      return res.json({
        status: 'success',
        message: 'Account verified successfully',
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  },

  registerUser: async (req, res, next) => {
    try {
      const { username, email, password } = req.body;

      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const payload = {
        username,
        email,
        password: hashedPassword,
      };
      const user = await User.create(payload);

      // Create successful
      res.status(201).json({
        message: 'User created successfully, verification email sent',
        status: 201,
        data: user,
        payload,
      });
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }

      // password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Opps, wrong password' });
      }

      // verified
      if (user.verified === false) {
        return res.status(401).json({ message: 'Email not verified' });
      }

      // jwt
      const expiresIn = '2 days';
      const token = jwt.sign({ id: user._id, role: user.role, verified: user.verified }, process.env.JWT_SECRET, {
        expiresIn,
      });

      // login successful
      res.status(200).json({
        message: 'Login successful',
        status: 200,
        data: { token, expiresIn },
      });
    } catch (error) {}
  },

  // changePassword:
  changePassword: async (req, res) => {
    try {
      const { email, password, newPassword } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      if (user.verified === false) {
        return res.status(401).json({ message: 'Email not verified' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Opps, wrong password' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // forgotPassword
  sendOTP: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'Authentication brow' });
      }
      if (!user.verified) {
        return res.status(401).json({ message: 'Email not verified' });
      }

      // Generate OTP
      const otp = otpGenerator.generate(6, {
        upperCase: false,
        specialChars: false,
      });

      // Update OTP in user's database record
      user.otp = otp;
      await user.save();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
      if (user.verified === false) {
        return res.status(401).json({ message: 'Email not verified' });
      }
      if (user.otp === '') {
        return res.status(401).json({ message: 'OTP not found' });
      }
      if (user.otp !== otp) {
        return res.status(401).json({ message: 'OTP not match' });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.otp = '';
      await user.save();
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default userController;
