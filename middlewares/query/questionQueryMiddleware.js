const AsyncErrorWrapper = require("express-async-handler");
const {searchHelper, populateHelper, questionSortHelper, paginationHelper} = require('../query/queryMiddlewareHelper');


const questionQueryMiddleware = function(model,options){
    return AsyncErrorWrapper(async function(req,res,next) {
        // Initial Query
        let query = model.find({});
        let pagination

        // Search Parameter
        query = searchHelper("title",query,req);
        
        // Populate If Available
        
        if (options && options.population) {
            query = populateHelper(query,options.population);
        }
        
        query = questionSortHelper(query,req)

        const paginationResult = await paginationHelper(model,query,req)

        query = paginationResult.query
        pagination = paginationResult.pagination

        const queryResults = await query

        res.queryResults = {
            success: true,
            count: queryResults.length,
            pagination: pagination,
            data: queryResults
        }

        next();
    })
}; 


module.exports = questionQueryMiddleware;