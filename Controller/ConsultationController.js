const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('../Model/userQuery');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());


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

