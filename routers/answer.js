const express = require('express')
const { getAccessToRoute, getAnswerOwnerAccess } = require('../middlewares/authorization/auth')
const { addNewAnswerToQuestion, getAllAnswersByQuestions, getSingleAnswer, editAnswer, deleteAnswer, likeAnswer} = require('../controllers/answer')
const { checkQuestionAndAnswerExist } = require('../middlewares/database/databaseErrorHelper')
const router = express.Router({mergeParams: true}) // question_id almak icin

router.post('/', getAccessToRoute, addNewAnswerToQuestion)
router.get('/', getAllAnswersByQuestions)
router.get('/:answer_id', checkQuestionAndAnswerExist, getSingleAnswer)
router.get('/:answer_id/like', [checkQuestionAndAnswerExist, getAccessToRoute], likeAnswer)
router.put('/:answer_id/edit', [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess], editAnswer)
router.delete('/:answer_id/delete', [checkQuestionAndAnswerExist, getAccessToRoute, getAnswerOwnerAccess], deleteAnswer)

module.exports = router

