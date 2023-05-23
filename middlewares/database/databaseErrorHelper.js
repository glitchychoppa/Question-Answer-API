const CustomError = require("../../helpers/error/CustomError");
const Answer = require("../../models/answers");
const questions = require("../../models/questions");
const user = require("../../models/user");
const AsyncErrorWrapper = require('express-async-handler')

const checkUserExist = AsyncErrorWrapper(async (req,res,next) => {
    const {id} = req.params

    const User = await user.findById(id)

    if (!User) {
        return next(new CustomError('This is no such user with that id'), 400)
    }

    next()
})

const checkQuestionExist = AsyncErrorWrapper(async (req,res,next) => {
    const question_id = req.params.id || req.params.question_id

    const question = await questions.findById(question_id)


    if (!question) {
        return next(new CustomError('This is no such question with that id'), 400)
    }

    next()
})

const checkQuestionAndAnswerExist = AsyncErrorWrapper(async (req,res,next) => { 
    const question_id = req.params.question_id

    const answer_id = req.params.answer_id

    const answer = await Answer.findOne({
        _id: answer_id,
        question: question_id
    })

    if (!answer) {
        return next(new CustomError('There is no answer with that id associated with question id'), 400)
    }

    next()
})

module.exports = {
    checkUserExist,
    checkQuestionExist,
    checkQuestionAndAnswerExist
}
