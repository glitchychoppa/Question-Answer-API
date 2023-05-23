const express = require('express')
const router = express()
const {Register, getUser, Login, Logout, ImageUpload, forgotPassword, resetPassword, editDetails} = require('../controllers/auth')
const {getAccessToRoute} = require('../middlewares/authorization/auth')
const profileImageUpload = require('../helpers/libraries/profileImageUpload')

router.post("/register", Register)
router.post("/login", Login)
router.get("/profile", getAccessToRoute, getUser)
router.get('/logout', getAccessToRoute, Logout)
router.post('/forgotpassword', forgotPassword)
router.post('/upload', [getAccessToRoute, profileImageUpload.single('profile_image')], ImageUpload)
router.put('/resetpassword', resetPassword)
router.put("/edit", getAccessToRoute, editDetails)

module.exports = router