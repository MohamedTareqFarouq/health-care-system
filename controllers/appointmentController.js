import appointment from "../db/models/appointment.js";

export const bookAppointment = async (req, res) => {
    try {
        console.log("Booking appointment with data:", req.body);
        const { patientName, doctorName, appointmentDate, reason, additionalNotes } = req.body;

        const newAppointment = new appointment({
            patientName,
            doctorName,
            appointmentDate,
            reason,
            additionalNotes
        });

        await newAppointment.save();
        res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ message: "Error booking appointment", error: error.message });
    }
}
