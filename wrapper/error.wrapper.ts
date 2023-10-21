import winston from 'winston'
import { MongoServerError } from 'mongodb'
import { MongooseError } from 'mongoose'
import { CustomRequestError } from '@/lib/error/request'
import { NextResponse } from 'next/server'

// Create a logger instance
const logger = winston.createLogger({
  level: 'error', // Set the log level (e.g., 'info', 'error', 'debug', 'warn')
  format: winston.format.json(), // Use JSON format for logs
  transports: [
    // Specify transports to output logs (e.g., console, file)
    new winston.transports.Console(),
    // new winston.transports.File({ filename: 'app.log' }) // Optional: Save logs to a file
  ],
})

/**
 * Determine Error message to forward to client base on the type of error
 * @param error - Error
 * @returns an error message string
 * @todo Check for a more narrowed error. Currently, too Generic
 */
function getErrorMessage(error: any) {
    let errorMessage = ''
    switch(true) {
        case error instanceof CustomRequestError:
            /**
             * This is our custom error 
             * It should contain a clear message
             */
            errorMessage = error.message
            break

        case error instanceof MongoServerError:
            /**
             * Mongo Server Error
             * It include 'duplicate' and some other erros
             */
            errorMessage = error.code === 11000 ? 'Duplicate data received' : 'Server Error. Error has been reported'
            break

        case error instanceof MongooseError:
            /**
             * Mongoose Error
             * It includes 'validationError', 'castError' etc
             */
            errorMessage = 'Provide a valid input'
            break
        
        default:
            /**
             * What could this be?
             * @todo Narrow down error checking
             */
            errorMessage = 'Error occurred. Error has been reported'
    }
   
    return errorMessage
}

/**
 * Error Wrapper helper that automatically catch error originating from request & response function handler
 * @param func - The original request & response handler function
 * @returns 
 */
export default function withRequestErrorr<T extends Function>(func: T) {

    return function withErrorhandler(...restParams: any[]) {

        if (func.constructor && func.constructor.name === 'AsyncFunction') {
            return func(...restParams).catch((error: any) => {
                console.log('error', error)
                // send response
                // log to error reporting service
                logger.error(error)
                
                /** Mongoose Error code for duplicate entry is 11000
                 * Thus, we capped error to 599 to avoid http range error
                 */
                const status = error.code < 599 ? error.code : (error.errorCode || 500)
                return NextResponse.json({
                    success: false,
                    message: getErrorMessage(error),
                    data: null,
                    code: status
                }, {status})
            })
        }

        try {
            return func(...restParams) 
        } catch (error: any) {
            // send response
            // log to error reporting service
            logger.error(error)

            const status = error.code < 599 ? error.code : (error.errorCode || 500)
            return NextResponse.json({
                success: false,
                message: getErrorMessage(error),
                data: null,
                code: status
            }, {status})
        }
    
    }
}

export function genericErrorHandler<T extends Function>(func: T) {
    function handler(...args: any[]) {
        try {
            return func(args)
        } catch (error) {
            // log to error reporting service
            logger.error(error)
        }
    }

    return handler
}