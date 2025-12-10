const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    error: "Too many requests, please try again later."
  },
  standardHeaders: true, // return rate limit info in the headers
  legacyHeaders: false   // disable the X-RateLimit headers
});

module.exports = limiter;
