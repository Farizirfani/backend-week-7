const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
  });
};

export default notFoundHandler;
