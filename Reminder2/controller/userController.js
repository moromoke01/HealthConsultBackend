const {User} = require('../model/userModel') 

//get all users
exports.getUser = async(req, res)=>{
    try{
        let id= {_id:req.params.id};
        let users = await User.findOne(id);

        if(!users)
        return res.status(404).json({
            success: false,
            message: "user not found",
        })
        res.status(200).json({
            success: true,
            message: 'User found',
            users,
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            Error: error.message
        })
    }
}

//create users
exports.createUser = async (req, res)=>{
    try{
        let user = await req.body;
        console.log(user)
        let userCreated = await User.create(user);

        if(!userCreated)
        return res.status(404).json({
            success:false,
            message: 'user creation failed',
            
        })
         res.status(200).json({
            success:true,
            message: 'user created successfully',
            user:userCreated
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            Error: error.message
        })
    }
}