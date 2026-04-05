import express from 'express';
import bodyParser from 'body-parser';
import Booking from '../Model/BookingModel.js';
import cors from 'cors';
import dotenv from 'dotenv';
import DoctorAvailability from '../Model/DoctorAvailabilityModel.js';

dotenv.config();

const router = express.Router();
router.use(bodyParser.json());
router.use(cors());


//POST route to create availability
router.post('/set-availability', async (req, res) => {
    try{
        const {doctorId, date, time} = req.body;

        const availability = await DoctorAvailability.create({
            doctorId,
            date,
            time
        });
        res.json({ 
            success: true, 
            message: "Availability set successfully",
            availability 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

//fetch doctor's availability
router.get("/:doctorId", async (req, res) => {
    const bookings = await Booking.find({ 
        doctorId: req.params.doctorId, 
        status: "booked" });

        const formatted = bookings.map(b => ({
            date: b.date,
            time: b.time,
            appointmentDate: `${b.date}T${b.time}`
        }))
    res.json({
        success: true,
        bookings: formatted
    });
});


//booking time slot appointment by patient
// router.post('/bookSlot', async (req, res) => {
//     try {
//         const { patientId, doctorId, date, time} = req.body;

//         //check if already booked or blocked
//         const availability = await DoctorAvailability.findOne({ doctorId, date ,time, status: {$in:["booked", "blocked"]}});

//         if (availability) {
//             return res.status(404).json({
//                 success: false,
//                 message: "this time slot is unavailable."
//             });
//         }


//         //create booking record
//         const booking = await Booking.create({
//             patientId,
//             doctorId,
//             date,
//             time,
//             status: 'booked'
//         })

//         res.json({
//             success: true,
//             message: "time booked successfully",
//             booking
//         });
//     } catch (err) {
//         res.status(500).json({
//             success: false, 
//             message: err.message

//         });
//     }
// });


router.post('/bookSlot', async (req, res) => {
    try {
        let { patientId, doctorId, date, time, appointmentDate} = req.body;

        if (appointmentDate){
            const [d, t] = appointmentDate.split('T');
            date = d;
            time = t;
        }

        
        if (!doctorId || !patientId || !date || !time){
            return res.status(400).json({
                success:false,
                message: "missing required field"
            })
        }
        
        //check if already booked or blocked
        // const availability = await DoctorAvailability.findOne({ doctorId, date ,time, status: {$in:["booked", "blocked"]}});
        const alreadyBooked = await Booking.findOne({
            doctorId,
            date,
            time,
            status:'booked'
        });

        const alreadyBlocked = await Booking.findOne({
            doctorId,
            date,
            time,
            status:'booked'
        });


        // if (availability) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "this time slot is unavailable."
        //     });
        // }

        if (alreadyBooked || alreadyBlocked){
            return res.status(400).json({
                success:false,
                message: "This time slot is already booked or blocked"
            });
        }

        //create booking record
        const booking = await Booking.create({
            patientId,
            doctorId,
            date,
            time,
            status: 'booked'
        })

        res.status(200).json({
            success: true,
            message: "time slot booked successfully",
            booking
        });
    } catch (err) {
        res.status(500).json({
            success: false, 
            message: err.message

        });
    }
});




//Doctor blot availability or put availability on hold i.e update availability
router.patch('/blockslot', async (req, res) => {
    try {
        const { doctorId, date, time} = req.body;

        const availability = await DoctorAvailability.findOne({ doctorId, date, time, status: {$in: ["booked", "blocked"]} });

        if (availability) {
            return res.status(404).json({
                success: false,
                message: "This slot is already taken or blocked"
            });
        }
        const blockedSlot = await Booking.create({
            doctorId,
            date,
            time,
            status: 'blocked'
        });
     res.json({
        success: true,
        message: "Slot blocked successfully",
        blockedSlot
     });

} catch (err) {
    res.status(500).json({
        success: false,
        message: err.message
    });         
}
});

export default router;