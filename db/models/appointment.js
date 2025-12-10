import mongoose from'mongoose';

const appointmentSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true
    },
    doctorName:{
        type: String,
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    additionalNotes: {
        type: String,
        required: false
    }
});

export default mongoose.model("Appointment", appointmentSchema)