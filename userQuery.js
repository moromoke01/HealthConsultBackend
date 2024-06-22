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
        type: String
    },
    healthQuery:{
        type: String
    },
    symptoms:{
        type: String

    },
    scheduleDate:{
        type: Date

    },
    scheduleTime:{
        type: String
        // Timestamp,
        

    }
},
{
    collection: "ConsulterQuery"
})
mongoose.model("ConsulterQuery",UserQuerySchema)