const AsyncErrorWrapper = require('async-wrapper-express')
const User = require('../models/user')
const CustomError = require('../helpers/error/CustomError')

const getSingleUser = AsyncErrorWrapper(async (req,res,next) => { 
    const {id} = req.params

    const user = await User.findById(id)

    return res.status(200).json({
        success: true,
        data: user
    })
})

const getAllUsers = AsyncErrorWrapper(async (req,res,next) => { 
    return res.status(200).json(res.queryResults)
})


module.exports = {getSingleUser, getAllUsers}