

// const mongodbConfig = require('./config').mongodb

const mongoose = require('mongoose');
const { mongodb } = require('./config');
const logger = require('./logger')

mongoose.Schema.Types.Boolean.convertToFalse.add('');

let collection = null
let db=null

const dbConnect = async() => {
    const connectionOptions = {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    };
    mongoose.set("strictQuery", true);
    mongoose.connect(mongodb.url);
    db=mongoose.connection
    db.on("connected", () => {
        logger.info("Connected to database sucessfully");
        let listOfCollections = Object.keys(db.collections);
        collection = listOfCollections
        Promise.resolve("hello connected")

    });

    db.on("error", (err) => {
        console.log("Error while connecting to database :" + err);
    });

    db.on("disconnected", () => {
        console.log("Mongodb connection disconnected");
    });

    db.on("close", () => {
        console.log("Closes to database sucessfully");
    });

}


const  listCollection = async() => {
    // if(collection) {
    //     console.log("return collection 😎");
    //     return collection
    // }

    // without return we will get undefined
    
    return new Promise((resolve, reject)=>{
        if(collection)  resolve(collection)
        else reject(null)
    })
}



const closeDB =  async() => {
    if (db) {
        await mongoose.connection.close()
        console.log("Mongoose Closing Connection...");
        // process.exit(0)
    }
    else console.log("No Connection To Close...");
}




module.exports = { dbConnect, closeDB, listCollection }