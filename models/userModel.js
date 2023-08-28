import mongoose from 'mongoose';

const User = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: 'user',
  },
  otp: {
    type: String,
    default: '',
  },
});

export default mongoose.model('Users', User);
