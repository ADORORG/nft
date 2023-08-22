import { Connection, Model, Document } from 'mongoose';
import { dbCollections } from './lib/app.config';

export interface MongooseContext {
    connection: Connection,
    models: {
        [key in typeof dbCollections as string]: Model<Document>
    }
}