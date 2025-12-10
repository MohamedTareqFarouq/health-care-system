import appointment from "../db/models/appointment.js";

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
