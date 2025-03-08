const mongoose = require("mongoose")

const PatientInfoSchema = new mongoose.Schema({
    fname: {
        type:String,
        required

    },
    lname:{
        type:String,
        required
        
    },
    gender:{
        type:String,
        required
    },
    age:{
        type: Number,
        required
    },
    location:{
        type: String,
        required
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    
    password: {
        type:String,
        required:true
},


},
{
    timestamps: true
})

const PatientInfo = mongoose.model("users", ConsulterDetailSchema);

module.exports = PatientInfo