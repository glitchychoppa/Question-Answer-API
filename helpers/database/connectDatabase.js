const mongoose = require('mongoose')

const connectDatabase = async (URI) => {
    await mongoose.connect(URI)
    .then(() => console.log('Veritabanı bağlandı'))
    .catch((err) => console.log(err)) 
}

module.exports = connectDatabase