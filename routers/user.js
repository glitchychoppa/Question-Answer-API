const express = require('express')
const {getAllUsers, getSingleUser} = require('../controllers/user.js')
const router = express.Router()
const {checkUserExist} = require('../middlewares/database/databaseErrorHelper')
const {userQueryMiddleware} = require('../middlewares/query/userQueryMiddleware.js')
const User = require('../models/user.js')


router.get('/', userQueryMiddleware(User), getAllUsers)
router.get('/:id', checkUserExist, getSingleUser)



module.exports = router