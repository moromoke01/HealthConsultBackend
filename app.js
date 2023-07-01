const express = require("express")
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors =require("cors");
app.use(cors());
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());

const JWT_SECRET_KEY = 'hfPghfuDty3kbinujHlbk8Ut7jmRn8676cr456&78898.mjkhB65fgc9ytutVlu9y8y8756rd09trgfvbg5vhhAnm8.tuydg87IKhugV2KJGDGGHKAS6897675vbznkjdthjDJLSAsarlEHlv656cSAf '

const mongoUrl="mongodb+srv://janet:janet0166@cluster0.hz2mb5d.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() =>{
    console.log("Connected to database")
})
.catch((e) => console.log(e));

require("./ConsulterDetails");
require("./userQuery");

const User = mongoose.model("ConsulterInfo");
const Query = mongoose.model("HealthQuery");


//sign-up route
app.post("/Register", async(req, res) =>{
 
    try{
        const { fname, lname, email, password} = req.body;

       // checking if email already exist
        const oldUser =await User.findOne({email});

        if(oldUser){
           return res.status(405).json({
            message:'Email already exists'
           })           
        }

        //encrypting the password
        const encryptedPassword = await bcrypt.hash(password, 10);
         
//creating a new user
//const newUser = new User({email, encryptedPassword});
//await newUser.save();
        await User.create({
            fname,
            lname,
            email,
            password:encryptedPassword,
        })
        res.status(201).json({
            message: 'User successfully registered'
        })
    }catch(error){
        console.error('Error during sign-up', error);
        res.status(500).json({
            message: 'Server error'
        })
    };
});


//login route
app.post("/Login", async(req, res) =>{
    try{
        const { email, password} = req.body;

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
                message: 'Invalid email or password'
            })
        }

        //const { fname, lname} =userData;
        //User is authenticated, generate a token or session
        const token = jwt.sign({ userId: findUser._id}, JWT_SECRET_KEY)
        res.status(200).json({
            message:'Login successful',
            data:token
        });
    }catch(error){
        console.error('Error:', error);
        res.status(500).json({
            message: 'Internal Server error'
        })
    };
});

//HealthQuery route
app.post("/ConsultingSection", async(req, res) =>{
    try{
        const { specialist, healthQuery, symptoms, scheduleDate, scheduleTime} = req.body;
    
    await Query.create({
        specialist, 
        healthQuery, 
        symptoms, 
        scheduleDate, 
        scheduleTime
    })
    res.status(201).json({
        message: 'Your Health Query has been recorded'
    })
    res.status(500).json({
        message: 'Internal Server Error'
    })
}catch(error){
    console.log('error sending query', error)
}
});

//get heathQuery data from database
// app.get('/Feedback', (req, res) =>{
//     Query.find()
//     .then(Querycall =>res.json(Querycall))
//     .catch(err => res.json(err))
// })

app.get('/ConsultingSection', async(req, res) =>{
    try{
        //fetch the data from MongoDB
        const data = await Query.find();

        //send the data in the response
        res.json(data);
    }catch(error){
         console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Internal server error' });
    }
})


const PORT =5000;

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
});