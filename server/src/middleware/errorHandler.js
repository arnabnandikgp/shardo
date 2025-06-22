const { z } = require("zod");

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: "Validation Error",
      details: err.errors,
    });
  }
  
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
};

module.exports = {
  errorHandler,
};
