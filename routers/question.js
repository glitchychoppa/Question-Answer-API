const express = require('express')
const router = express()
const {askNewQuestion, getAllQuestions, getSingleQuestion, editQuestion, deleteQuestion, likeQuestion} = require('../controllers/question')
const {getAccessToRoute, getAdminAccess, getQuestionOwnerAccess} = require('../middlewares/authorization/auth')
const { checkQuestionExist } = require('../middlewares/database/databaseErrorHelper')
const answer = require('./answer')
const Question = require('../models/questions')
const questionQueryMiddleware = require('../middlewares/query/questionQueryMiddleware')
const answerQueryMiddleware = require('../middlewares/query/answerQueryMiddleware')

router.post('/ask', getAccessToRoute, askNewQuestion)
router.get('/:id',  checkQuestionExist, answerQueryMiddleware(Question, {
    population: [
        {
            path: "user",
            select: "name profile_image"
        },
        {
            path: "answers",
            select: "content"
        }
    ]
}), getSingleQuestion)

router.get("/", questionQueryMiddleware(Question, { 
    population : {
        path:"user",
        select:"name profile_image"
    }
}), getAllQuestions);


router.put("/:id/edit", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], editQuestion)
router.put("/:id/delete", [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], deleteQuestion)
router.get("/:id/like", [getAccessToRoute, checkQuestionExist], likeQuestion)
router.use('/:question_id/answers', checkQuestionExist, answer)


module.exports = router
