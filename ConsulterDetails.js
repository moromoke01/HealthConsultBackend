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
},


},
{
    collection: "users"
})

mongoose.model("users", ConsulterDetailSchema)