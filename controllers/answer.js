const Question = require("../models/questions");
const Answer = require('../models/answers');
const AsyncErrorWrapper = require("express-async-handler");
const CustomError = require("../helpers/error/CustomError");

const addNewAnswerToQuestion = AsyncErrorWrapper(async (req,res,next) => {
    const {question_id} = req.params;
    const user_id = req.user.id;
    
    const information = req.body;
    
    const answer = await Answer.create({
        ...information,
        question : question_id,
        user: user_id
    });
    
    return res.status(200)
    .json({
        success : true,
        data : answer
    });
});

const getAllAnswersByQuestions = AsyncErrorWrapper(async (req,res,next) => { 
    const {question_id} = req.params;

    const question = await Question.findById(question_id).populate('answers') // Answersin tüm bilgilerini getirir eğer kullanılmazsa sadece idsini gösterir.

    const answers = question.answers

    return res.status(200).json({
        success: true,
        count: answers.length,
        data: answers
    })
})

const getSingleAnswer = AsyncErrorWrapper(async (req,res,next) => { 
    const {answer_id} = req.params

    const answer = await Answer
    .findById(answer_id)
    .populate({
        path: 'question', // Bu sekilde sadece iceriginde istedigimiz bilgiyi alabiliyoruz
        select: "title",

    })
    .populate({
        path: "user",
        select: "name profile_image" // Eger birden fazla bilgi alacaksak bosluk ile ayirmamiz gerekiyor
    })


    return res.status(200).json({
        success: true,
        data: answer
    })
})

const editAnswer = AsyncErrorWrapper(async (req,res,next) => { 
    const {answer_id} = req.params

    const {content} = req.body

    let answer = await Answer.findById(answer_id)

    answer.content = content

    await answer.save()

    res.status(200).json({
        success: true,
        data: answer
    })
})

const deleteAnswer = AsyncErrorWrapper(async (req,res,next) => { 
    const {answer_id, question_id} = req.params

    await Answer.findByIdAndDelete(answer_id)

    const question = await Question.findById(question_id)

    question.answers.splice(question.answers.indexOf(answer_id)) // Array icerisinden de deger siliyor.
    question.answerCount = question.answers.length

    res.status(200).json({
        success: true,
        message: "Delete progress successfull"
    })
})

const likeAnswer = AsyncErrorWrapper(async (req,res,next) => {

        const {answer_id} = req.params
    
        const answer = await Answer.findById(answer_id)
    
        if (answer.likes.includes(req.user.id)) {
            answer.likes = answer.likes.filter(function(data) {
                return data != req.user.id
            })
        } else {
            answer.likes.push(req.user.id)
        }
    
        answer.question = question.likes.length

        await answer.save()
    
        return res.status(200).json({
            success: true,
            data: answer
        })    
})

module.exports = {
    addNewAnswerToQuestion,
    getAllAnswersByQuestions,
    getSingleAnswer,
    editAnswer,
    deleteAnswer,
    likeAnswer
}
