import express from 'express';
import Joi from 'joi';
import { getAppointments, bookAppointment } from '../controllers/appointmentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateBody } from "../middleware/validate.js";

const router = express.Router();

const appointmentSchema = Joi.object({
    doctorId: Joi.string().required(),
    appointmentDate: Joi.date().greater('now').required(),
    reason: Joi.string().max(500).required(),
    additionalNotes: Joi.string().max(1000).optional()
})

router.get('/appointments', authenticate, authorize("user", "admin", "doctor"), getAppointments);
router.post('/appointments/book', validateBody(appointmentSchema), authenticate, authorize("user", "admin", "doctor"), bookAppointment);

export default router;