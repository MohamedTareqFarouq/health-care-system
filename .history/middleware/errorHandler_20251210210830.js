const logger = {
  error: (msg, data) => console.error(msg, data),
  warn: (msg, data) => console.warn(msg, data),
};

class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, "Resource not found"));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  if (status >= 500) {
    logger.error("Server Error", { message: err.message, stack: err.stack });
  } else {
    logger.warn("Client Error", { status, message, details: err.details });
  }

  res
    .status(status)
    .json({ error: { message, status, details: err.details || undefined } });
};

export { ApiError, errorHandler, notFoundHandler };
