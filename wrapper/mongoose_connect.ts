import { connect } from 'mongoose';

declare global {
	var _mongooseDbConnection: any;
}

const NODE_ENV = process.env.NODE_ENV as string; 
const DB_HOST = process.env.DB_HOST as string; 

let mongodbConnectionPromise;

if (NODE_ENV === 'development') {
	// preserve database connection
	if (!global._mongooseDbConnection) {
		global._mongooseDbConnection = connect(DB_HOST); 
	}

	mongodbConnectionPromise = global._mongooseDbConnection;

} else {
	mongodbConnectionPromise = connect(DB_HOST);
}

export default mongodbConnectionPromise as any;