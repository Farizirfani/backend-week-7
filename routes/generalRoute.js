import express from 'express';

const generalRoute = express.Router();

generalRoute.get('/', (req, res) => {
  res.json({
    message: 'welcome in ..',
    data: [
      {
        endpoint: '/auth/register',
        method: 'post',
      },
      {
        endpoint: '/auth/login',
        method: 'post',
      },
    ],
  });
});

export default generalRoute;
