const router = require('express').Router();
const controller =require("../controller/userController")

router.get("/:id", controller.getUser);
router.post("/", controller.createUser);



module.exports =router