import express from 'express';
import Joi from 'joi';
import { getAppointments, bookAppointment, cancelAppointment } from '../controllers/appointmentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateBody } from "../middleware/validate.js";

const router = express.Router();

const appointmentSchema = Joi.object({
    doctorId: Joi.string().required(),
    appointmentDate: Joi.date().greater('now').required(),
    reason: Joi.string().max(500).required(),
    additionalNotes: Joi.string().max(1000).optional()
})

const cancelAppointmentSchema = Joi.object({
    appointmentId: Joi.string().required(),
    reason: Joi.string().max(500).required()
})

router.get('/appointments', authenticate, authorize("user", "admin", "doctor"), getAppointments);
router.post('/appointments/book', validateBody(appointmentSchema), authenticate, authorize("user", "admin", "doctor"), bookAppointment);
router.post('/appointments/cancel', validateBody(cancelAppointmentSchema), authenticate, authorize("user", "admin", "doctor"), cancelAppointment);

export default router;