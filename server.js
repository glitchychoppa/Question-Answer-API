const express = require('express')
const connectDatabase = require('./helpers/database/connectDatabase')
const app = express()
const env = require('dotenv').config({
    path: "./config/config.env"
})
const {PORT, MONGOSE_URI} = process.env
const routers = require('./routers')
const errorHandler = require('./middlewares/errors/customErrorHandler')
const path = require("path")


// Body Requests

app.use(express.json())

// Middleware 

app.use('/api', routers)
app.use(errorHandler)

// Database Connect 

connectDatabase(MONGOSE_URI)

// Static Files 

app.use(express.static(path.join(__dirname, "public"))) // Dirname lokasyonundaki public klasörü express npmi

// App Start

app.listen(PORT, () => { 
    console.log(`API uygulaması başlatıldı || http://localhost:${PORT}/`)
})

