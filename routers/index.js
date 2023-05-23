const express = require('express')
const router = express.Router()

const auth = require('./auth')
const question = require('./question')
const user = require('./user')
const admin = require('./admin')

router.use('/auth', auth)
router.use('/questions', question)
router.use('/users', user)
router.use('/admin', admin)


module.exports = router