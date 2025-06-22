const { authenticateToken } = require("./auth");
const { errorHandler } = require("./errorHandler");

module.exports = {
  authenticateToken,
  errorHandler,
}; 