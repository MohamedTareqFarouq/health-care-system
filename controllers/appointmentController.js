import appointment from "../db/models/appointment.js";

export const getAppointments = async (req, res, next) => {
    try {
        const user = req.user;
        const filter = {};

        if (user.role === 'doctor') {
            filter.doctor = user.id;
        }

        if (user.role === 'user') {
            filter.patient = user.id;
        }

        const appointments = await appointment.find(filter).populate('doctor', 'name').populate('patient', 'name');
        res.status(200).json({ appointments });
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
