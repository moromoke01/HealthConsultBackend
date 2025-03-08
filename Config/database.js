require('dotenv').config();

const mongoose =require ('mongoose');

mongoose.connect(process.env.uri)
.then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});