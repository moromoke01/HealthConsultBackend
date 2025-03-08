const express = require("express")
const mongoose = require("mongoose");
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const userRouter = require('./Router/UserRouter')
require("dotenv").config();

// const {authenticationToken, authorizeRoles} = require('./middleware/authMiddleware');
// const userController = require('./Controller/userController');


const app = express(); 
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());



//database connection
const connect = require('./Config/database')

//connecting Routes
app.use("/api/", userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
})
