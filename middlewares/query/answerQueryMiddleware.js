const AsyncErrorWrapper = require('express-async-handler')
const { paginationHelper, populateHelper } = require('./queryMiddlewareHelper')

const answerQueryMiddleware = function(model,options) {
    return AsyncErrorWrapper(async function(req,res,next) {
        const {id} = req.params

        const arrayName = "answers"

        const total = (await model.findById(id))["answerCount"]
        
        const paginationResult = await paginationHelper(total, undefined, req)

        const startIndex = paginationResult.startIndex
        const limit = paginationResult.limit

        let QueryObject = {}

        QueryObject[arrayName] = {$slice : [startIndex,limit]}

        let query = model.find({_id : id}, QueryObject)

        query = populateHelper(query, options.population)

        const queryResults = await query

        res.queryResults = {
            success: true,
            pagination: paginationResult.pagination,
            data: queryResults

        }

        next()
    })
}

module.exports = answerQueryMiddleware