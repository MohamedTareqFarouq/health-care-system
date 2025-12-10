import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        trim: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        trim: true
    },
    appointmentDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > new Date();
            },
            message: "Appointment date must be in the future"
        }
    },
    reason: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    additionalNotes: {
        type: String,
        required: false,
        trim: true,
        maxlength: 1000
    },
    status: {
        type: String,
        enum: ["pending", "scheduled", "completed", "canceled"],
        default: "pending"
    }
}, {
    timestamps: true,
}
);

appointmentSchema.statics.isDoctorAvailable = async function (doctorId, date) {
    return !(await this.exists({ doctor: doctorId, appointmentDate: date, status: 'scheduled' }));
};

export default mongoose.model("Appointment", appointmentSchema)