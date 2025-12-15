/** Sign Up: **/

TYPE: POST /signup

Body: {
    "email": "example@email.com",
    "password": "password@123",
    "name": "mohamed"
}

Response: {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzllY2U4ODgwOWQ0MDFhOTkyNjEzYSIsInJvbGUiOiJ1c2VyIiwiZW1haWwiOiJtaWRvdGVyYXFAZ21haWwuY29tIiwibmFtZSI6Im1vaGFtZWQiLCJpYXQiOjE3NjU0MDM4ODAsImV4cCI6MTc2NTU3NjY4MH0.8kyF7jhi0OwNE7CNOup9tKaY04Vj1ncQcHcwbKzDSHw",
    "user": {
        "id": "6939ece88809d401a992613a",
        "email": "example@email.com",
        "role": "user",
        "name": "mohamed"
    }
}



/** Login: **/

TYPE: POST /login

Body: {
    "email": "example@email.com",
    "password": "password@123",
}

Response: {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzllY2U4ODgwOWQ0MDFhOTkyNjEzYSIsInJvbGUiOiJ1c2VyIiwiZW1haWwiOiJtaWRvdGVyYXFAZ21haWwuY29tIiwibmFtZSI6Im1vaGFtZWQiLCJpYXQiOjE3NjU0MDM4ODAsImV4cCI6MTc2NTU3NjY4MH0.8kyF7jhi0OwNE7CNOup9tKaY04Vj1ncQcHcwbKzDSHw",
    "user": {
        "id": "6939ece88809d401a992613a",
        "email": "example@email.com",
        "role": "user",
        "name": "mohamed"
    }
}



/** get appointments for patient/doctor/admin: **/

TYPE: GET /appointments

Response: {
    "appointments": [
        {
            "_id": "693d6c1033484a560e0b3b46",
            "patient": {
                "_id": "6939ece88809d401a992613a",
                "name": "mohamed"
            },
            "doctor": {
                "_id": "6939ef6a56b0e9d42eab2666",
                "name": "ahmed"
            },
            "appointmentDate": "2025-12-25T00:00:00.000Z",
            "reason": "To have a medical opinion on a certain disease case",
            "additionalNotes": "any additional notes...",
            "status": "pending",
            "createdAt": "2025-12-13T13:37:20.391Z",
            "updatedAt": "2025-12-13T13:37:20.391Z",
            "__v": 0
        },
        {
            "_id": "693d6ffd894a41bcec5ee20c",
            "patient": {
                "_id": "6939ef6a56b0e9d42eab2666",
                "name": "ahmed"
            },
            "doctor": {
                "_id": "6939ef6a56b0e9d42eab2666",
                "name": "ahmed"
            },
            "appointmentDate": "2025-12-25T00:00:00.000Z",
            "reason": "To have a medical opinion on a certain disease case",
            "additionalNotes": "any additional notes...",
            "status": "pending",
            "createdAt": "2025-12-13T13:54:05.479Z",
            "updatedAt": "2025-12-13T13:54:05.479Z",
            "__v": 0
        },
        {
            "_id": "693d709e894a41bcec5ee21d",
            "patient": {
                "_id": "6939ece88809d401a992613a",
                "name": "mohamed"
            },
            "doctor": {
                "_id": "693d7043894a41bcec5ee215",
                "name": "said"
            },
            "appointmentDate": "2025-12-25T00:00:00.000Z",
            "reason": "To have a medical opinion on a certain disease case",
            "additionalNotes": "any additional notes...",
            "status": "shceduled",
            "createdAt": "2025-12-13T13:56:46.780Z",
            "updatedAt": "2025-12-13T13:56:46.780Z",
            "__v": 0
        },
        {
            "_id": "69401c7e1caa0e3a870959ca",
            "patient": {
                "_id": "6939ef6a56b0e9d42eab2666",
                "name": "ahmed"
            },
            "doctor": {
                "_id": "693d7043894a41bcec5ee215",
                "name": "said"
            },
            "appointmentDate": "2025-12-25T00:00:00.000Z",
            "reason": "To have a medical opinion on a certain disease case",
            "additionalNotes": "any additional notes...",
            "status": "pending",
            "createdAt": "2025-12-15T14:34:38.379Z",
            "updatedAt": "2025-12-15T14:34:38.379Z",
            "__v": 0
        }
    ],
    "countsPerStatus": [
        {
            "_id": "shceduled",
            "total": 1
        },
        {
            "_id": "pending",
            "total": 3
        }
    ]
}



/** Make appointment: **/

TYPE: POST /appointments/book

Body: {
    "doctor": _id, => required
    "appointmentDate": "2025-12-25", => required
    "reason": "To have a medical opinion on a certain disease case", => required
    "additionalNotes": "any additional notes..." => not required
}

Response: {
    "message": "Appointment booked successfully",
    "appointment": {
        "patient": "6939ece88809d401a992613a",
        "doctor": "6939ef6a56b0e9d42eab2666",
        "appointmentDate": "2025-12-25T00:00:00.000Z",
        "reason": "To have a medical opinion on a certain disease case",
        "additionalNotes": "any additional notes...",
        "status": "pending",
        "_id": "6939ef9456b0e9d42eab2668",
        "createdAt": "2025-12-10T22:09:24.763Z",
        "updatedAt": "2025-12-10T22:09:24.763Z",
        "__v": 0
    }
}
