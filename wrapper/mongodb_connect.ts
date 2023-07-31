import { MongoClient } from 'mongodb'

declare global {
	var _mongodbConnectionPromise: Promise<MongoClient>
}

const NODE_ENV = process.env.NODE_ENV as string 
const DB_HOST = process.env.DB_HOST as string 

let mongodbConnectionPromise: Promise<MongoClient>, client: MongoClient

if (NODE_ENV === 'development') {
	// preserve database connection
	if (!global._mongodbConnectionPromise) {
		client = new MongoClient(DB_HOST)
		global._mongodbConnectionPromise = client.connect() 
	}

	mongodbConnectionPromise = global._mongodbConnectionPromise

} else {
	client = new MongoClient(DB_HOST)
	mongodbConnectionPromise = client.connect()
}

export default mongodbConnectionPromise