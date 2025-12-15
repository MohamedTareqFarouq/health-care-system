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

        console.log("Filter applied for fetching appointments:", filter);
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
        console.log("Booking appointment with data:", req.body);
        const { doctorId, appointmentDate, reason, additionalNotes } = req.body;

        const patientId = req.user.id;
        console.log("Authenticated user ID:", patientId);

        const newAppointment = new appointment({
            patient: patientId,
            doctor: doctorId,
            appointmentDate,
            reason,
            additionalNotes
        });

        await newAppointment.save();
        res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
    } catch (error) {
        next(error);
    }
}
