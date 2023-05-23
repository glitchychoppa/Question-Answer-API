const { isTokenIncluded, getAccessTokenFromHeader } = require("../../helpers/authorization/tokenHelpers")
const CustomError = require("../../helpers/error/CustomError")
const AsyncErrorWrapper = require('express-async-handler')
const jwt = require('jsonwebtoken')
const user = require("../../models/user")
const Question = require("../../models/questions")
const Answer = require("../../models/answers")

const getAccessToRoute = (req,res,next) => { 

    const {JWT_SECRET_KEY} = process.env
    if (!isTokenIncluded(req)) {
        return next(new CustomError("You are not authorized to access this route.", 401))
    }

    const accessToken = getAccessTokenFromHeader(req)

    jwt.verify(accessToken, JWT_SECRET_KEY, (err,decoded) => { 

        if (err) {
            if (err.name === "TokenExpiredError") {
                return next(new CustomError('Expired Token', 401))
            } else { 
                return next(new CustomError('You are not authorized to access this route.', 401))
            }
        } 

        req.user = {
            id: decoded.id,
            name: decoded.name
        }


        next()
    })
}

const getQuestionOwnerAccess = AsyncErrorWrapper(async (req,res,next) => {
    const userId = req.user.id
    const questionId = req.params.id

    const question = await Question.findById(questionId)

    if (question.user != userId) {
        return next(new CustomError("Only owner can handle this operation"), 403)
    }

    next()
})

const getAnswerOwnerAccess = AsyncErrorWrapper(async (req,res,next) => {
    const userId = req.user.id
    const answerId = req.params.answer_id

    const answer = await Answer.findById(answerId)

    if (answer.user != userId) {
        return next(new CustomError("Only owner can handle this operation"), 403)
    }

    next()
})

const getAdminAccess = AsyncErrorWrapper(async (req,res,next) => {
    const {id} = req.user

    const User = await user.findById(id)

    if (User.role !=="admin") {
        return next(new CustomError('Only admin can access this route'), 403) 
    }
    next()
})


module.exports = {getAccessToRoute, getAdminAccess, getQuestionOwnerAccess, getAnswerOwnerAccess}
