const express = require("express")
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors =require("cors");
app.use(cors());
const bcrypt = require('bcryptjs');

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

app.post("/Login", async(req, res) =>{
    const { email, password} = req.body;
    
    try{

        //find the user by email
        const findUser =await User.findOne({email});

        if(!findUser){
           return res.status(404).json({
            message: 'User not found'
           });
        }
        //compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare( password, findUser.password);

        if(!isPasswordValid){
            return res.status(401).json({
                message: 'Invalid password'
            })
        }
        //User is authenticated, generate a token or session

        res.status(200).json({
            message:'Login successful'
        });
    }catch(error){
        console.error('Error:', error);
        res.status(500).json({
            message: 'Internal Server error'
        })
    };
});

//Register API
app.post("/Register", async(req, res) =>{
    const { fname, lname, email, password} = req.body;
    //encrypting the password
    const encryptedPassword = await bcrypt.hash(password, 10);
    try{

        //checking if password already exist
        // const oldUser =await User.findOne({email});

        // if(oldUser){
        //    return res.send({error: "User already Exists"})
        // }
         

        await User.create({
            fname,
            lname,
            email,
            password:encryptedPassword,
        })
        res.send({status: "ok"})
    }catch(error){
        res.send({status:"error"})
    };
});



app.listen(5000, () =>{
    console.log("Server is running")
});