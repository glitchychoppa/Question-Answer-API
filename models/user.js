const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const Question = require('./questions')

const UserSchema = new Schema({
    name : {
        type : String, 
        required: [true, 'Lütfen isminizi girin']
    },

    email : {
        type : String, 
        required: [true, 'Lütfen email adresi girin'],
        unique: true,
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            "Lütfen geçerli bir email adresi girin"
        ]
    },

    role : { 
        type: String, 
        default: "user", 
        enum : ["user", "admin"]
    },

    password : {
        type: String, 
        minlenght: [6, "6 karakterli veya daha uzun bir şifre girmeniz gerekir"],
        required: [true, "Lütfen şifre giriniz"],
        select: false
    },

    createdAt : {
        type: Date, 
        default : Date.now
    },

    title : { 
        type : String
    },

    about : {
        type : String
    },

    website : {
        type : String
    },

    profile_image : {
        type: String,
        default : "default.jpg"
    },
    
    blocked : {
        type : Boolean,
        default : false
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: String,
    }
})



UserSchema.methods.generateJwtFromUser = function() { 
    const {JWT_SECRET_KEY, JWT_EXPIRE} = process.env


    const payload = {
        id: this._id,
        name: this.name,
    }

    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRE
    })

    return token
}

UserSchema.methods.getResetPasswordTokenFromUser = function() { 
    const randomHexString = crypto.randomBytes(15)
    const {RESET_PASSWORD_EXPIRE} = process.env

    const resetPasswordToken = crypto.createHash("SHA256").update(randomHexString).digest('hex')


    this.resetPasswordToken = resetPasswordToken
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE)

    return resetPasswordToken
}

UserSchema.pre('save', function(next) {
    if(!this.isModified('password')) {
        next()
    }


    bcrypt.genSalt(10, (err,salt) => {
        if (err) next(err)

        bcrypt.hash(this.password , salt, (err, hash) => {
            if(err) next(err)

            this.password = hash
            next()
        })
    })
})

UserSchema.post("findOneAndDelete", async function(doc, next){
    await Question.deleteMany({
        user: doc._id
    })
});

module.exports = mongoose.model("User", UserSchema)