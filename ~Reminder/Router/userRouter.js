const router = require('express').Router();
const controller = require("../controller/userController")

router.get('/', controller.getUsers);
router.post('/',controller.createUser);
router.get('/:id', controller.getEachUser);
router.put('/:id', controller.updateUser)


module.exports = router;