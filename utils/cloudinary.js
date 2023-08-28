import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dkxpvy9el',
  api_key: process.env.API_KEY_CLOUD,
  api_secret: process.env.API_SECRET,
});
