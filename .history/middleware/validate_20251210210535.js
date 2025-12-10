import Joi from 'joi';
import { ApiError } from './errorHandler.js';

const validateBody = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) return next(new ApiError(400, 'Validation error', error.details.map(d => d.message)));
  req.body = value;
  next();
};

const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, { abortEarly: false, stripUnknown: true });
  if (error) return next(new ApiError(400, 'Validation error', error.details.map(d => d.message)));
  req.query = value;
  next();
};

export { validateBody, validateQuery };


