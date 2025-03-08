const express = require("express")
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors =require("cors");
app.use(cors());
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
require("dotenv").config();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());


const JWT_SECRET_KEY = 'hfPghfuDty3kbinujHlbk8Ut7jmRn8676cr456&78898.mjkhB65fgc9ytutVlu9y8y8756rd09trgfvbg5vhhAnm8.tuydg87IKhugV2KJGDGGHKAS6897675vbznkjdthjDJLSAsarlEHlv656cSAf '

// const mongoUrl="mongodb+srv://janet:janet0166@cluster0.hz2mb5d.mongodb.net/?retryWrites=true&w=majority";

// mongoose.connect(mongoUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })

mongoose.connect("mongodb://localhost:27017/VirtualHealthConsultation")
.then(() =>{
    console.log("Connected to database")
})
.catch((e) => console.log(e));

// require("./Model/ConsulterDetails");
require("./Model/userQuery");

const User = mongoose.model("users");
const Query = mongoose.model("ConsulterQuery");


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
        const findUser =await User.findOne ({email});

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

        
        //User is authenticated, generate a token or session
        const token = jwt.sign({ userId: findUser._id}, JWT_SECRET_KEY);
        res.cookie("token", token, {
          httpOnly: true,
          // Additional cookie options if needed
          // secure: true,
          // sameSite: "strict",
        });

        // const { fname, lname} = findUser;

        res.status(200).json({
            message:'Login successful',
            userId: findUser._id,
            fname: findUser.fname,
            lname: findUser.lname,
            token:token
        });
    }catch(error){
        console.error('Error:', error);
        res.status(500).json({
            message: 'Internal Server error'
        })
    };
});



app.get("/LoginData", async(req, res) =>{
  try{
      const { email, password} = req.body;

      //find the user by email
      const findUser =await User.findOne ({email});

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

      
      //User is authenticated, generate a token or session
      const token = jwt.sign({ userId: findUser._id}, JWT_SECRET_KEY);
      res.cookie("token", token, {
        httpOnly: true,
        // Additional cookie options if needed
        // secure: true,
        // sameSite: "strict",
      });

      // const { fname, lname} = findUser;

      res.status(200).json({
          message:'Login successful',
          userId: findUser._id,
          fname: findUser.fname,
          lname: findUser.lname,
          token:token
      });
  }catch(error){
      console.error('Error:', error);
      res.status(500).json({
          message: 'Internal Server error'
      })
  };
});

// Backend code (Node.js)
// app.post('/ConsultingSection', async (req, res) => {
//   try {
//     // Get the userId from the request headers
//     const userId = req.headers['userId']; // Make sure to use lowercase 'userid' in headers

//     // Assuming you have the FormData model/schema defined and you're using Mongoose
//     // Create a new instance of the FormData model and set the userId
//     const formData = new Query({
//       ...req.body,
//       userId: userId
//     });

//     // Save the form data to the database
//     await formData.save();

//     res.status(200).json({
//       message: 'Your Health Query has been recorded'
//     });
//   } catch (error) {
//     console.log('Error sending query:', error);
//     res.status(500).json({
//       message: 'Internal Server Error'
//     });
//   }
// });

// HealthQuery route
app.post("/ConsultingSection", async (req, res) => {
    try {
      const { specialist, healthQuery, symptoms, scheduleDate, scheduleTime, userId } = req.body;
  
      // Retrieve the user ID from the request headers or cookies
      //const userId = req.headers.userId || req.cookies.userId;

      // const userId = req.headers['userId'];
      
      console.log(req.body);

      // Check if the user ID is available
      if (!userId) {
        return res.status(401).json({
          message: 'Unauthorized: User ID not provided',
        });
      }
  
      // Create a new query document and associate it with the user ID
      await Query.create({
        userId:userId,
        specialist,
        healthQuery,
        symptoms,
        scheduleDate,
        scheduleTime
      });
  
      res.status(200).json({
        message: 'Your Health Query has been recorded'
      });
    } catch (error) {
      console.log('Error sending query:', error);
      res.status(500).json({
        message: 'Internal Server Error'
      });
    }
  });


//fetching data from two collection 'User' & 'Query'
app.get('/getConsulterData', async(req, res) =>{
  try{
    //fetch data from the Query collection and perform the $lookup stage
    const data = await Query.aggregate([
      {
        $lookup:{
          from: 'users',      //the name of the 'users' collection
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',    //since $lookup returns an array, unwind it to get a single object
      },
    ]).exec();

    res.json(data);
  }catch(error){
    console.log('Error fetching data', error);
    res.status(500).json({
      message:'Internal server error'
    })
  }
});





//send email using NodeMailer

app.post('/send-email', (req, res) =>{
  const {to, subject, emailContent} = req.body;

  //replace with SMTP email configuration
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
      user: process.env.EMAIL,
      pass: process.env.PASS
    },
    tls:{
      rejectUnauthorized:false,
    }
  })


const mailOptions = {
  from: process.env.EMAIL,
  to:to,
  subject:subject,
  html: emailContent,
};

transporter.sendMail(mailOptions, (error, info) =>{
      if(error){
        console.log(error);
        res.status(500).send('Error sending email');
      }else{
        console.log('Email sent:' + info.response);
        res.status(200).send('Email sent successfully')
      }
})

});

//options for the HTTPs request
// const options ={
//   hostname:'',
//   port:443,
//   path:
//}


  //port connection
const PORT =5000;

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)
});