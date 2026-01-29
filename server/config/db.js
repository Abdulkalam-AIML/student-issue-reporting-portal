const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`Local MongoDB Connection Failed: ${error.message}`);
        console.log('Attempting to start in-memory database...');
        try {
            const mongod = await MongoMemoryServer.create({
                instance: {
                    launchTimeout: 60000, // Increase timeout to 60s
                },
            });
            const uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log(`Fallback: Connected to In-Memory MongoDB at ${uri}`);
        } catch (memError) {
            console.error(`Fallback Failed: ${memError.message}`);
            process.exit(1);
        }
    }
};

module.exports = connectDB;
