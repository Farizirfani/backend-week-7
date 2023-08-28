import transporter from './transporter.js';
import otpGenerator from 'otp-generator';
import User from '../models/userModel.js';

const forgotPassword = async (req, res) => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
    digits: true,
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: req.body.email,
    subject: 'Forgot Password OTP',
    html: `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f5f5f5;">
      <div style="max-width: 400px; margin: 0 auto; background-color: #ffffff; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #007bff; color: #ffffff; padding: 10px 0; border-radius: 5px 5px 0 0;">
          <h1>Your OTP Code</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hello, ${req.body.email}</p>
          <p>Here is your OTP (One-Time Password) code:</p>
          <h2 style="background-color: #007bff; color: #ffffff; padding: 10px; border-radius: 5px; display: inline-block;">${otp}</h2>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this OTP, please ignore this email.</p>
        </div>
        <div style="background-color: #f0f0f0; padding: 10px; text-align: center; border-radius: 0 0 5px 5px;">
          <p>Do not reply to this email. This is an automated message.</p>
        </div>
      </div>
    </div>
        `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending verification email:', error);
      return res.status(500).json({ message: 'Failed to send verification email' });
    }
    console.log('Verification email sent:', info.response);
    return res.status(200).json({
      message: 'OTP sent to your email',
    });
  });

  const { email } = req.body;
  const user = await User.findOne({ email });
  try {
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    if (user.verified === false) {
      return res.status(401).json({ message: 'Email not verified' });
    }
    user.otp = otp;
    await user.save();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default forgotPassword;
