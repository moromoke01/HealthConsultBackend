const { Timestamp } = require("mongodb")
const mongoose = require("mongoose")

const UserQuerySchema = new mongoose.Schema({
    specialist:{
        type: String
    },
    heathQuery:{
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

    }
},
{
    collection: "HealthQuery"
})
mongoose.model("HealthQuery",UserQuerySchema)