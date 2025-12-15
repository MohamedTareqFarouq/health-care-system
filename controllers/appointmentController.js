import appointment from "../db/models/appointment.js";
import mongoose from "mongoose";

export const getAppointments = async (req, res, next) => {
    try {
        const user = req.user;
        const filter = {};

        if (user.role === 'doctor') {
            filter.doctor = new mongoose.Types.ObjectId(user.id);
        } else if (user.role === 'user') {
            filter.patient = new mongoose.Types.ObjectId(user.id);
        }

        // Fetch appointments
        const appointments = await appointment.find(filter)
            .populate('doctor', 'name')
            .populate('patient', 'name');


        // Count per status with the same filter
        const countsPerStatus = await appointment.aggregate([
            { $match: filter }, // important!
            {
                $group: {
                    _id: "$status",
                    total: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({ appointments, countsPerStatus });
    } catch (error) {
        next(error);
    }
}


export const bookAppointment = async (req, res, next) => {
    try {
        const { doctorId, appointmentDate, reason, additionalNotes } = req.body;

        const patientId = req.user.id;

        const newAppointment = new appointment({
            patient: patientId,
            doctor: doctorId,
            appointmentDate,
            reason,
            additionalNotes,
            statusHistory: [{
                status: 'pending',
                reason: reason,
                changedBy: patientId
            }]
        });

        await newAppointment.save();
        res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
    } catch (error) {
        next(error);
    }
}


export const cancelAppointment = async (req, res, next) => {
    try {
        const appointmentId = new mongoose.Types.ObjectId(req.body.appointmentId);
        const authId = new mongoose.Types.ObjectId(req.user.id);
        const { reason } = req.body;

        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            return res.status(400).json({ message: "Invalid appointment ID" });
        }

        if (!mongoose.Types.ObjectId.isValid(authId)) {
            return res.status(400).json({ message: "Invalid patient ID" });
        }

        let filter = {
            _id: appointmentId,
            status: { $in: ['scheduled', 'pending'] }
        };

        if (req.user.role === 'user') {
            filter.patient = authId;
        } else if (req.user.role === 'doctor') {
            filter.doctor = authId;
        }


        const cancelledAppointment = await appointment.findOneAndUpdate(filter, {
            $set: { status: 'cancelled' },
            $push: {
                statusHistory: {
                    status: 'cancelled',
                    reason: reason || 'Cancelled by patient',
                    changedBy: authId
                }
            }
        }, { new: true });

        if (!cancelledAppointment) {
            return res.status(404).json({ message: "Appointment not found or cannot be cancelled" });
        }

        res.status(200).json({ message: "Appointment cancelled successfully", appointment: cancelledAppointment });
    } catch (error) {
        next(error);
    }
}

