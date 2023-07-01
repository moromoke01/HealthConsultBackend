const {Schema, model} =require ('mongoose')

const userSchema = new Schema({
    Username:{
        type:String,
        required:true,
        minlength:3,
        maxlength:15
    },
    email:{
        type:String,
        required:true,
        unique: true,
        minlength:3,
        maxlength:15
    },
    age:{
        type:Number,
        default:null
    },
    IsUser:{
        type:Boolean,
        default:null
        
    },
    IsAdmin:{
        type:Boolean,
        default:false,
        
    },
},
  {timestamps : true}
);
const userModel = model("User", userSchema);

module.exports =userModel;