const mongoose = require("mongoose")

const UserQuerySchema = new mongoose.Schema({
    // userId:{
    //     type: String
    // },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //this reference the 'users' collection
    },
    specialist:{
        type: String,
        required
    },
    healthQuery:{
        type: String,
        required
    },
    symptoms:{
        type: String,
        required

    },
    scheduleDate:{
        type: Date,
        required

    },
    scheduleTime:{
        type: String ,
        required    
    }
},
// {
//     collection: "ConsulterQuery"
// },
{
    timestamps: true,
})
const PatientQuery = mongoose.model("ConsulterQuery",UserQuerySchema);

module.exports = PatientQuery