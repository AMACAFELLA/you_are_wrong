import mongoose from 'mongoose'

let isConnected = false

const connectToDb = async () => {
    // to prevent unknown field queries
    mongoose.set('strictQuery', true);

    if (!process.env.MONGODB_URL || !process.env.MONGODB_URL) {
        return console.error("MongoDb URL not found")
    }
    if (isConnected) {
        // console.error("Already connected to MongoDb")
        return
    }
    try {
        // console.log(process.env.MONGODB_URL);
        // const env = process.env.NODE_ENV
        // let url = "";
        // if (env === "development") {
        const url = process.env.MONGODB_URL;
        // }
        // else if (env === "production") {
        //     // @ts-ignore
        //     url = process.env.MONGODB_PROD;
        // }
        console.log("Mongodb url " + url);
        await mongoose.connect(url)
        isConnected = true
        return console.log("Connected to MongoDb")

    } catch (e) {
        return console.error(e)

    }

}

export { connectToDb }