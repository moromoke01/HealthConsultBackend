const express = require('express')
const app = express()
const { json} = require('express')
const connect =require ('./config/database')
const userRoute = require ('./Router/userRoute')
app.use('/user', userRoute)
app.use(express.json())
const PORT = process.env.PORT || 3000;

connect();

app.get("/", bodyParser.json(), (req, res)=>{
    res.send("Coding into Mongo database")
})

app.listen(PORT, ()=>{
    console.log(`Janet's server running on port ${PORT}`)
})