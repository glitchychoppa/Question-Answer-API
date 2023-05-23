const AsyncErrorWrapper = require('express-async-handler')
const CustomError = require('../helpers/error/CustomError')
const Question = require('../models/questions')

const getAllQuestions = AsyncErrorWrapper(async (req,res,next) => {

    console.log(res.queryResults)
    return res
    .status(200)
    .json(res.queryResults)
})

const getSingleQuestion = AsyncErrorWrapper(async (req,res,next) => {
    res.status(200).json({
        success: true,
        data: question
    })
})

const askNewQuestion = AsyncErrorWrapper(async (req,res,next) => {
    const information = req.body;

    const question = await Question.create({
        ... information, // Bunu araştır
        user: req.user.id
    })

    res.status(200).json({
        success: true,
        data: question
    })

})

const editQuestion = AsyncErrorWrapper(async (req,res,next) => {
    const {id} = req.params

    const {title,content} = req.body

    let question = await Question.findById(id)

    question.title = title
    question.content = content

    question = await question.save()

    return res.status(200).json({
        success: true,
        data: question
    })
})

const deleteQuestion = AsyncErrorWrapper(async (req,res,next) => {
    const {id} = req.params

    await Question.findByIdAndDelete(id)

    return res.status(200).json({
        success: true,
        message: "Delete process successfull"
    })
})

const likeQuestion = AsyncErrorWrapper(async (req,res,next) => {
    const {id} = req.params

    const question = await Question.findById(id)

    if (question.likes.includes(req.user.id)) {
        question.likes = question.likes.filter(function(data) {
            return data != req.user.id
        })
    } else {
        question.likes.push(req.user.id)
    }

    question.answerCount = question.likes.length
    await question.save()

    return res.status(200).json({
        success: true,
        data: question
    })
})


module.exports = {getAllQuestions, askNewQuestion, getSingleQuestion, editQuestion, deleteQuestion, likeQuestion} 
