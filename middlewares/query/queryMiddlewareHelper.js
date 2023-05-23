
const searchHelper = (searchKey, query, req) => { 
        // Search 

        if (req.query.search) { 
            const searchObject = {}
            const regex = new RegExp(req.query.search, 'i')
            searchObject[searchKey] = regex
    
            return query = query.where(searchObject)
            // Question.find().where({title:  "regexicerigi"})
        }    

        return query
}

const populateHelper = (query, population) => {
    return query.populate(population)
}

const questionSortHelper = (query,req) => { 
    const sortKey = req.query.SortBy

    if (sortKey === "most-answered") { 
        return query.sort("-answerCount -createdAt") // Tarih koymamizin sebebi cevap sayisi ayniysa en guncel tarihte atilan seyi ust tarafta gosterecek
    } 

    if (sortKey === 'most-liked') {
        return query.sort('-likeCount -createdAt') // Ayni sekilde yukaridaki aciklamaya gore
    }

    return query.sort("-createdAt")
}

const paginationHelper = async (total, query, req) => { 
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    let pagination = {}
    const totalDocuments = total 

    if (startIndex < 0) {
        pagination.previous = {
            page: page - 1,
            limit : limit
        }   
    }

    if (endIndex < totalDocuments) {
        pagination.next = {
            page: page + 1,
            limit: limit
        }
    }

    return { 
        query: query === undefined ? undefined : query.skip(startIndex).limit(limit),
        pagination: pagination,
        startIndex,
        limit
    }    
}


module.exports = { searchHelper, populateHelper, questionSortHelper, paginationHelper}