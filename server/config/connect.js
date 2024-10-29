const mongoose = require('mongoose')
require('dotenv').config()

const connectDb = async()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGODB)
        console.log("connected to Database");
        
    } catch (error) {
        console.log(`Failed to connect to database, issue:${error.message}`);
    }
}
module.exports = connectDb;