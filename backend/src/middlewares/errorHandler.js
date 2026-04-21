import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.message || "Internal server error"
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (statusCode >= 500) {
    logger.error("Unhandled error", err);
  } else {
    logger.warn("Handled error", err.message);
  }

  res.status(statusCode).json(payload);
};
