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

}

},
{
    collection: "users"
})

mongoose.model("users", ConsulterDetailSchema)