const mongoose = require("mongoose");

const mongodbConnect = async () => {
    const mongo_url = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.1'
    await mongoose.connect(mongo_url)
    console.log("Connected to mongodb")
}

module.exports = mongodbConnect()