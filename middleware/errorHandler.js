const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        title: "Validation Failed",
        message:
          err.message ||
          "The provided data is invalid. Please check your input.",
      });
      break;

    case constants.NOT_FOUND:
      res.json({
        title: "Not Found",
        message: err.message || "The requested resource could not be found.",
      });
      break;

    case constants.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message:
          err.message || "You do not have permission to access this resource.",
      });
      break;

    case constants.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        message:
          err.message || "Authentication is required to access this resource.",
      });
      break;

    case constants.SERVER_ERROR:
      res.json({
        title: "Server Error",
        message:
          err.message ||
          "An internal server error occurred. Please try again later.",
      });
      break;

    default:
      res.status(500).json({
        title: "Unexpected Error",
        message: "An unexpected error occurred. Please contact support.",
      });
      break;
  }
};

module.exports = errorHandler;
