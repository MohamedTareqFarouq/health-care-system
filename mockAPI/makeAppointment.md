/** Make appointment: **/

TYPE: POST /appointments/book

Body: {
    "patientName": "Ahmed", => required
    "doctorName": "mohamed", => required
    "appointmentDate": "2025-12-25", => required
    "reason": "To have a medical opinion on a certain disease case", => required
    "additionalNotes": "any additional notes..." => not required
}

Response: {
    "message": "Appointment booked successfully",
    "appointment": {
        "patientName": "Ahmed",
        "doctorName": "mohamed",
        "appointmentDate": "2025-12-25T00:00:00.000Z",
        "reason": "To have a medical opinion on a certain disease case",
        "additionalNotes": "any additional notes...",
        "_id": "6939bca232c19b7c71a1626b",
        "__v": 0
    }
}

Error fromat: "Error booking appointment: error.message"
