const { Timestamp } = require("mongodb")
const mongoose = require("mongoose")

const ConsulterDetailSchema = new mongoose.Schema({
    fname: {
        type:String

    },
    lname:{
        type:String
        
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    
    password: {
        type:String,
        required:true
}
})
const HealthQuerySchema = new mongoose.Schema({
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
})

const User =mongoose.model("User", ConsulterDetailSchema, "UserSchema"  )

const Query =mongoose.model("Query", HealthQuerySchema, "Health_Query"  )
 
const mySchemas = {'Users':Users, 'Query': Query}

module.exports = mySchemas