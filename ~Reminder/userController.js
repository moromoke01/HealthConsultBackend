const {Users} = require("../Model/userModel");
const {v4 :uuid } = require ('uuid')



//get all users
exports.getUsers = async (req, res) =>{
    try{
        const AllUsers = Users;

        res.status(200).json({
            message: "All Users record",
            Users: AllUsers
        });
    }catch(err){
        res.status(500).json({
            message:err.message
        });
    }
}

//create users
exports.createUser = async(req, res)=>{
    try{
        const { name, email, password } = await req.body;
        console.log(req.body);
        
        const freshUser={
            id: uuid(),
            name,
            email,
            password,
        };
        Users.push(freshUser);

        res.status(201).json({
            message: "New user created",
            freshUser,
        });
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

//fetch single user
exports.getEachUser = async (req, res)=>{
    try{
        id= req.params.id;
        const EachUser = Users.find((userEach)=> userEach.id === id)

        res.status(200).json({
            message: "User found",
            EachUser,
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}
//update users

exports.updateUser = async(req, res)=>{
    try{
        id = req.params.id;
        const userChange = Users.find((userEach) =>userEach.id === id);

        const { name, email, password}= await req.body;

        userChange.name =name;
        userChange.email = email;
        userChange.password = password;

        res.status(200).json({
            message: "User sucessfully updated",
            userChange,
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}
//deleting user
