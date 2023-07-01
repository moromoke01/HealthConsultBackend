const express = require("express")
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors =require("cors");
app.use(cors());


const mongoUrl="mongodb+srv://janet:janet0166@cluster0.hz2mb5d.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() =>{
    console.log("Connected to database")
})
.catch((e) => console.log(e));

require("../ConsulterDetails");

const User = mongoose.model("ConsulterInfo")

app.get("/",cors(),async(req, res) =>{
    const { email, password} = req.body;
    
    try{

        //checking if password already exist
        const check =await User.findOne({email:email});

        if(check){
            res.json("Exists")
        }else{
            res.json("notexists")
        }

    }catch(error){
        res.send({status:"error"})
    };
});

//Register API
app.post("/Register", async(req, res) =>{
    const { fname, lname, email, password} = req.body;
    
    try{

        //checking if password already exist
        const oldUser =await User.findOne({email});

        if(oldUser){
           return res.json( "exist")
        }else{
            res.json("notexist")
        }
         

        await User.create({
            fname,
            lname,
            email,
            password,
        })
        res.send({status: "ok"})
    }catch(error){
        res.send({status:"error"})
    };
});



app.listen(5000, () =>{
    console.log("Server is running")
});