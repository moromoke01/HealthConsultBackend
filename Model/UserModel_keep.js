const mongoose = require("mongoose")

const PatientInfoSchema = new mongoose.Schema({
    fname: {
        type:String,
        

    },
    lname:{
        type:String,
        
        
    },
    contact:{
        type: Number,
        
        
    },
    // gender:{
    //     type:String,
        
    // },
    // age:{
    //     type: Number,
        
    // },
    // location:{
    //     type: String,
        
    // },
    email:{
        type:String,
        unique:true,
        required:true
    },
    
    password: {
        type:String,
        required:true
},
role:{
    type:String,
    role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' } // Role-based user
}


},
{
    timestamps: true
})

const PatientInfo = mongoose.model("Patient", PatientInfoSchema);

module.exports = PatientInfo