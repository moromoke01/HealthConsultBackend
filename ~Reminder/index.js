const express = require("express")
const {json} = require ("express")

const userRecord = require ('./Router/userRouter')

const app =express();
app.use(json());

app.use("/user", userRecord);


app.get("/", (req, res)=>{
    res.send("retrying node from the past");
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`serving on port ${PORT}`));