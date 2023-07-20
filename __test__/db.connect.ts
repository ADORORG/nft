import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo: any = null;

export const connectDB = async () => {
    mongo = await MongoMemoryServer.create({
        binary: {
            version: '6.0.6',
        }
    });
    const uri = mongo.getUri();

    await mongoose.connect(uri);
}

export const dropDB = async () => {
    if (mongo) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongo.stop();
    }
}

export const dropCollections = async () => {
    if (mongo) {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.drop();
        }
    }
}