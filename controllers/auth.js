const AsyncErrorWrapper = require('async-wrapper-express')
const CustomError = require('../helpers/error/CustomError')
const {sendJwtToClient} = require('../helpers/authorization/tokenHelpers')
const { comparePassword, validateUserInput } = require('../helpers/input/inputHelpers')
const user = require('../models/user')
const sendEmail = require('../helpers/libraries/sendMailer')
const Register = AsyncErrorWrapper(async (req,res,next) => {

    const {name,email,password,role} = req.body

    const newUser = await user.create({
        name,
        email,
        password,
        role,
    })


    sendJwtToClient(newUser, res)
})



const getUser = AsyncErrorWrapper((req,res,next) => { 
    res.json({
        success: true,
        data : { 
            name: req.user.name,
            id: req.user.id
        }
    })
})

const Login = AsyncErrorWrapper(async (req,res,next) => { 
    const {email, password } = req.body
    if(!validateUserInput(email,password)) { 
        return next(new CustomError('Please check inputs', 400))
    }

    const User = await user.findOne({email}).select('+password')
    
    if ( !user || !comparePassword(password,User.password)) {
        return next(new CustomError("Please check your credentials"))
    }

    sendJwtToClient(User,res);

    res
    .status(200)
    .json({
        success: true,
        data: { 
            name: User.name,
            email: User.email
        }
    })


})

const Logout = AsyncErrorWrapper(async (req,res,next) => { 
    const {JWT_EXPIRE, NODE_ENV} = process.env

    return res.status(200)
    .cookie({
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: NODE_ENV === "development" ? false : true  
    }).json({ 
        success: true,
        messsage: "Logout successfull"
    })
})

const ImageUpload = AsyncErrorWrapper(async (req,res,next) => {
    
    const User = await user.findByIdAndUpdate(req.user.id, {
        "profile_image" : req.savedProfileImage
    }, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        data: User,
        message: "Successfull"
    })
})

const forgotPassword = AsyncErrorWrapper(async (req,res,next) => { 
    const resetEmail = req.body.email

    const User = await user.findOne({email : resetEmail})

    console.log(User)

    if (!User) {
        return next(new CustomError("There is no user with that email", 400))
    }

    const resetPasswordToken = User.getResetPasswordTokenFromUser()
    
    await User.save()

    const resetPasswordUrl = `https://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`

    const emailTemplate = `
        <h3>Parola Sıfırlama<h3>
        <p>Linke tıklayarak sıfırlama işlemini gerçekleştirebilirsiniz.
        <a href= '${resetPasswordUrl}' target = "_blank"> Link </a> 1 saat sonra geçersiz hale gelecektir. <p>

    `

    try {
        await sendEmail({
            from: process.env.SMTP_USER,
            to: resetEmail,
            subject: "Reset Your Password",
            html: emailTemplate
        })
        
        res.status(200).json({
            success: true,
            message: "Token Sent Your Email"
        })

    } catch(err) {
        console.log(err)
        
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await User.save()

    return next(new CustomError('Email Could Not Be Send', 500))


    }
})

const resetPassword = AsyncErrorWrapper(async (req,res,next) => { 

    const {resetPasswordToken} = req.query
    
    const {password} = req.body

    console.log(password)

    if (!resetPassword) { 
        return next(new CustomError('Please provide a valid token'), 400)
    }

    let User = await user.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()} // Date Nowdan buyukse getir // gt mongodb özelliğidir.
    })
    
    if (!User) {
        return next(new CustomError('Invalid Token or Session Expired'), 404)
    }

    User.password = password
    User.resetPassword = undefined
    User.resetPasswordExpire = undefined


    await User.save()


    return res.status(200).json({
        success: true,
        message: "Reset password process successful"
    })
})

const editDetails = AsyncErrorWrapper(async (req,res,next) => { 
    const editInformation = req.body

    const User = await user.findByIdAndUpdate(req.user.id, editInformation, {
        new: true,
        runValidators: true,
    })

    return res.status(200).json({
        success: true,
        data: User
    })


})



module.exports = {
    Register,
    getUser,
    Login,
    Logout,
    ImageUpload,
    forgotPassword,
    resetPassword,
    editDetails
}