const AsyncErrorWrapper = require('express-async-handler')
const express = require('express')
const router = express.Router()
const user = require('../models/user')
const {getAccessToRoute, getAdminAccess} = require('../middlewares/authorization/auth')
const {blockUser, deleteUser} = require('../controllers/admin')
const {checkUserExist} = require('../middlewares/database/databaseErrorHelper')


router.use([getAccessToRoute,getAdminAccess])

router.get('/block/:id',checkUserExist, blockUser)
router.delete('/user/:id',checkUserExist, deleteUser)



module.exports = router